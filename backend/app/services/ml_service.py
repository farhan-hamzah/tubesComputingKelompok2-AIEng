import logging
from typing import Any
import joblib
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from app.core.config import settings

logger = logging.getLogger(__name__)

# Label mapping sesuai output model NLP tim ML
# PENTING: Sesuaikan dengan label_encoder yang dipakai tim ML
SENTIMENT_LABELS = {0: "negatif", 1: "netral", 2: "positif"}


class EcommerceMLService:
    """
    Singleton-style service yang load semua model ML satu kali saat startup.
    
    Kenapa load di __init__ bukan per-request?
    - IndoBERT 474MB = ~2-3 detik load time
    - Per-request load = server tidak bisa handle concurrent users
    - Load sekali di startup = semua request share model yang sama di memory
    """

    def __init__(self) -> None:
        self._nlp_tokenizer: Any = None
        self._nlp_model: Any = None
        self._regression_model: Any = None
        self._classification_model: Any = None
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def load_all_models(self) -> None:
        """Dipanggil sekali di FastAPI startup event."""
        self._load_nlp_model()
        self._load_regression_model()
        self._load_classification_model()
        logger.info("Semua model berhasil di-load.")

    def _load_nlp_model(self) -> None:
        try:
            self._nlp_tokenizer = AutoTokenizer.from_pretrained(settings.NLP_MODEL_DIR)
            self._nlp_model = AutoModelForSequenceClassification.from_pretrained(
                settings.NLP_MODEL_DIR
            )
            self._nlp_model.to(self._device)
            self._nlp_model.eval()
            logger.info(f"NLP model loaded dari {settings.NLP_MODEL_DIR} di {self._device}")
        except Exception as e:
            logger.error(f"Gagal load NLP model: {e}")
            # Tidak raise — API tetap jalan, endpoint NLP return 503

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

    # ─── Public Inference Methods ─────────────────────────────────────────────

    def predict_sentiment(self, text: str) -> dict:
        """
        Input : raw review text
        Output: {"sentiment_label": str, "confidence_score": float}
        """
        if self._nlp_model is None or self._nlp_tokenizer is None:
            raise RuntimeError("NLP model belum ter-load")

        inputs = self._nlp_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=128,
            padding=True,
        )
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
        """
        Input : {"product_price": float, "product_category": str, "avg_rating": float}
        Output: predicted sold_count (float)
        
        CATATAN: Preprocessing (encoding category, scaling) harus sesuai
        dengan pipeline yang dipakai tim ML saat training. Jika mereka
        export Pipeline object (bukan raw model), tinggal panggil .predict().
        """
        if self._regression_model is None:
            raise RuntimeError("Regression model belum ter-load")

        # Jika tim ML export sklearn Pipeline lengkap dengan preprocessor:
        import pandas as pd
        df = pd.DataFrame([features])
        prediction = self._regression_model.predict(df)
        return float(prediction[0])

    def predict_top_product(self, features: dict) -> dict:
        """
        Input : {"product_price", "product_category", "avg_rating", "sold_count"}
        Output: {"is_top_product": bool, "confidence_score": float}
        """
        if self._classification_model is None:
            raise RuntimeError("Classification model belum ter-load")

        import pandas as pd
        df = pd.DataFrame([features])
        prediction = int(self._classification_model.predict(df)[0])

        # Ambil probabilitas jika model support predict_proba
        confidence = 0.0
        if hasattr(self._classification_model, "predict_proba"):
            proba = self._classification_model.predict_proba(df)[0]
            confidence = float(proba[prediction])

        return {
            "is_top_product": bool(prediction),
            "confidence_score": round(confidence, 4),
        }


# Instance global — dipakai sebagai dependency di router
ml_service = EcommerceMLService()