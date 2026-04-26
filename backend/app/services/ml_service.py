import logging
import re
from typing import Any
import joblib
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from app.core.config import settings

logger = logging.getLogger(__name__)

# Label dari notebook inference: Transactional, Transitional, Communal
# Model return label langsung dari pipeline HuggingFace — tidak perlu mapping manual

# KMeans cluster label — dynamic dari notebook (label_map)
# Kita set default, bisa disesuaikan setelah cek output model
CLUSTER_LABELS = {
    0: "Massal",
    1: "Premium",
    2: "Tidak layak",
}


def censor_pii(text: str) -> str:
    """Sensor PII sebelum masuk NLP model — sesuai notebook inference."""
    text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', '[EMAIL]', text)
    text = re.sub(r'\b\d{16}\b', '[NIK]', text)
    text = re.sub(r'\b(?:\+62|62|08)\d{8,12}\b', '[PHONE]', text)
    text = re.sub(r'\b\d{10,15}\b', '[REKENING]', text)
    return text


class EcommerceMLService:
    """
    Singleton-style service yang load semua model ML satu kali saat startup.
    """

    def __init__(self) -> None:
        self._nlp_pipeline: Any = None
        self._regression_model: Any = None
        self._classification_model: Any = None
        self._kmeans_model: Any = None
        self._scaler: Any = None
        self._device = 0 if torch.cuda.is_available() else -1

    def load_all_models(self) -> None:
        self._load_nlp_model()
        self._load_regression_model()
        self._load_classification_model()
        self._load_kmeans_model()
        logger.info("Semua model selesai diproses.")

    def _load_nlp_model(self) -> None:
        try:
            tokenizer = AutoTokenizer.from_pretrained(settings.NLP_MODEL_DIR)
            model = AutoModelForSequenceClassification.from_pretrained(settings.NLP_MODEL_DIR)
            self._nlp_pipeline = pipeline(
                "text-classification",
                model=model,
                tokenizer=tokenizer,
                device=self._device
            )
            logger.info(f"NLP pipeline loaded dari {settings.NLP_MODEL_DIR}")
        except Exception as e:
            logger.error(f"Gagal load NLP model: {e}")

    def _load_regression_model(self) -> None:
        try:
            self._regression_model = joblib.load(settings.REGRESSION_MODEL_PATH)
            logger.info(f"Regression model loaded")
        except Exception as e:
            logger.error(f"Gagal load regression model: {e}")

    def _load_classification_model(self) -> None:
        try:
            self._classification_model = joblib.load(settings.CLASSIFICATION_MODEL_PATH)
            logger.info(f"Classification model loaded")
        except Exception as e:
            logger.error(f"Gagal load classification model: {e}")

    def _load_kmeans_model(self) -> None:
        try:
            self._kmeans_model = joblib.load(settings.KMEANS_MODEL_PATH)
            self._scaler = joblib.load(settings.SCALER_MODEL_PATH)
            logger.info("KMeans + Scaler loaded")
        except Exception as e:
            logger.error(f"Gagal load KMeans/Scaler: {e}")

    # ─── Inference Methods ────────────────────────────────────────────────────

    def predict_sentiment(self, text: str) -> dict:
        if self._nlp_pipeline is None:
            raise RuntimeError("NLP model belum ter-load")

        # Sensor PII sebelum inference — sesuai notebook
        safe_text = censor_pii(text)
        result = self._nlp_pipeline(safe_text)[0]

        return {
            "sentiment_label": result["label"],
            "confidence_score": round(result["score"], 4),
        }

    def predict_sold_count(self, features: dict) -> float:
        """
        Input dict harus punya key: Category, Price, Overall Rating
        Pipeline regression sudah include preprocessor (PowerTransformer + OneHotEncoder)
        """
        if self._regression_model is None:
            raise RuntimeError("Regression model belum ter-load")
        import pandas as pd
        df = pd.DataFrame([features])
        return float(self._regression_model.predict(df)[0])

    def predict_top_product(self, features: dict) -> dict:
        """
        Input dict harus punya key: Category, Location, Price
        Pipeline classification sudah include OrdinalEncoder
        """
        if self._classification_model is None:
            raise RuntimeError("Classification model belum ter-load")
        import pandas as pd
        df = pd.DataFrame([features])
        prediction = int(self._classification_model.predict(df)[0])
        confidence = 0.0
        if hasattr(self._classification_model, "predict_proba"):
            proba = self._classification_model.predict_proba(df)[0]
            confidence = float(proba[prediction])
        return {
            "is_top_product": bool(prediction),
            "confidence_score": round(confidence, 4),
        }

    def predict_cluster(self, price: float, overall_rating: float, number_sold: float) -> dict:
        """
        KMeans pakai log-transform sebelum scaling — sesuai notebook.
        Input: Price, Overall Rating, Number Sold (nilai asli, bukan log)
        """
        if self._kmeans_model is None or self._scaler is None:
            raise RuntimeError("KMeans/Scaler belum ter-load")

        # Log transform sesuai notebook: log_price, Overall Rating, log_sold_count
        log_price = np.log1p(price)
        log_sold = np.log1p(number_sold)
        features = np.array([[log_price, overall_rating, log_sold]])
        scaled = self._scaler.transform(features)
        cluster_id = int(self._kmeans_model.predict(scaled)[0])

        return {
            "cluster_id": cluster_id,
            "cluster_label": CLUSTER_LABELS.get(cluster_id, f"Cluster {cluster_id}"),
        }

    def get_cluster_centers(self) -> dict:
        """Inverse transform cluster centers untuk scatter plot."""
        if self._kmeans_model is None or self._scaler is None:
            raise RuntimeError("KMeans/Scaler belum ter-load")

        centers_scaled = self._kmeans_model.cluster_centers_
        centers_raw = self._scaler.inverse_transform(centers_scaled)

        return {
            "clusters": [
                {
                    "cluster_id": i,
                    "cluster_label": CLUSTER_LABELS.get(i, f"Cluster {i}"),
                    # inverse dari log1p = expm1
                    "center_price": round(float(np.expm1(c[0])), 2),
                    "center_rating": round(float(c[1]), 4),
                    "center_sold_count": round(float(np.expm1(c[2])), 2),
                }
                for i, c in enumerate(centers_raw)
            ]
        }


ml_service = EcommerceMLService()