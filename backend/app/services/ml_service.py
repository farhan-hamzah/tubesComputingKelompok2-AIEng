import logging
from typing import Any
import joblib
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from app.core.config import settings

logger = logging.getLogger(__name__)

SENTIMENT_LABELS = {0: "negatif", 1: "netral", 2: "positif"}

CLUSTER_LABELS = {
    0: "Produk Massal",
    1: "Produk Premium",
    2: "Produk Gagal",
}


class EcommerceMLService:
    def __init__(self) -> None:
        self._nlp_tokenizer: Any = None
        self._nlp_model: Any = None
        self._regression_model: Any = None
        self._classification_model: Any = None
        self._kmeans_model: Any = None
        self._scaler: Any = None
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def load_all_models(self) -> None:
        self._load_nlp_model()
        self._load_regression_model()
        self._load_classification_model()
        self._load_kmeans_model()
        logger.info("Semua model selesai diproses.")

    def _load_nlp_model(self) -> None:
        try:
            self._nlp_tokenizer = AutoTokenizer.from_pretrained(settings.NLP_MODEL_DIR)
            self._nlp_model = AutoModelForSequenceClassification.from_pretrained(settings.NLP_MODEL_DIR)
            self._nlp_model.to(self._device)
            self._nlp_model.eval()
            logger.info(f"NLP model loaded dari {settings.NLP_MODEL_DIR} di {self._device}")
        except Exception as e:
            logger.error(f"Gagal load NLP model: {e}")

    def _load_regression_model(self) -> None:
        try:
            self._regression_model = joblib.load(settings.REGRESSION_MODEL_PATH)
            logger.info(f"Regression model loaded dari {settings.REGRESSION_MODEL_PATH}")
        except Exception as e:
            logger.error(f"Gagal load regression model: {e}")

    def _load_classification_model(self) -> None:
        try:
            self._classification_model = joblib.load(settings.CLASSIFICATION_MODEL_PATH)
            logger.info(f"Classification model loaded dari {settings.CLASSIFICATION_MODEL_PATH}")
        except Exception as e:
            logger.error(f"Gagal load classification model: {e}")

    def _load_kmeans_model(self) -> None:
        try:
            self._kmeans_model = joblib.load(settings.KMEANS_MODEL_PATH)
            self._scaler = joblib.load(settings.SCALER_MODEL_PATH)
            logger.info("KMeans + Scaler loaded")
        except Exception as e:
            logger.error(f"Gagal load KMeans/Scaler: {e}")

    def predict_sentiment(self, text: str) -> dict:
        if self._nlp_model is None or self._nlp_tokenizer is None:
            raise RuntimeError("NLP model belum ter-load")
        inputs = self._nlp_tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True)
        inputs = {k: v.to(self._device) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = self._nlp_model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1).squeeze().cpu().numpy()
        predicted_class = int(np.argmax(probs))
        confidence = float(probs[predicted_class])
        return {
            "sentiment_label": SENTIMENT_LABELS.get(predicted_class, "unknown"),
            "confidence_score": round(confidence, 4),
        }

    def predict_sold_count(self, features: dict) -> float:
        if self._regression_model is None:
            raise RuntimeError("Regression model belum ter-load")
        import pandas as pd
        df = pd.DataFrame([features])
        return float(self._regression_model.predict(df)[0])

    def predict_top_product(self, features: dict) -> dict:
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

    def predict_cluster(self, product_price: float, rating: float, sold_count: float) -> dict:
        """Segmentasi produk. Scaler normalize dulu sebelum masuk KMeans."""
        if self._kmeans_model is None or self._scaler is None:
            raise RuntimeError("KMeans/Scaler belum ter-load")
        features = np.array([[product_price, rating, sold_count]])
        scaled = self._scaler.transform(features)
        cluster_id = int(self._kmeans_model.predict(scaled)[0])
        return {
            "cluster_id": cluster_id,
            "cluster_label": CLUSTER_LABELS.get(cluster_id, f"Cluster {cluster_id}"),
        }

    def get_cluster_centers(self) -> dict:
        """Return cluster centers (inverse transform) untuk scatter plot Widget 4."""
        if self._kmeans_model is None or self._scaler is None:
            raise RuntimeError("KMeans/Scaler belum ter-load")
        centers_scaled = self._kmeans_model.cluster_centers_
        centers_original = self._scaler.inverse_transform(centers_scaled)
        return {
            "clusters": [
                {
                    "cluster_id": i,
                    "cluster_label": CLUSTER_LABELS.get(i, f"Cluster {i}"),
                    "center_price": round(float(c[0]), 2),
                    "center_rating": round(float(c[1]), 4),
                    "center_sold_count": round(float(c[2]), 2),
                }
                for i, c in enumerate(centers_original)
            ]
        }


ml_service = EcommerceMLService()