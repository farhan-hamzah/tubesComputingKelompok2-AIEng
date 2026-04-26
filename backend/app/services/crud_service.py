from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import models


class CRUDService:
    """Encapsulates semua operasi database."""

    # ─── Review / Sentiment ───────────────────────────────────────────────────

    def create_review_log(
        self, db: Session, review_text: str, sentiment_label: str, confidence_score: float
    ) -> models.ReviewLog:
        log = models.ReviewLog(
            review_text=review_text,
            sentiment_label=sentiment_label,
            confidence_score=confidence_score,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    def get_sentiment_stats(self, db: Session) -> dict:
        rows = (
            db.query(models.ReviewLog.sentiment_label, func.count())
            .group_by(models.ReviewLog.sentiment_label)
            .all()
        )
        stats = {"Transactional": 0, "Transitional": 0, "Communal": 0}
        for label, count in rows:
            if label in stats:
                stats[label] = count
        stats["total"] = sum(stats.values())
        return stats

    def get_recent_reviews(self, db: Session, limit: int = 20) -> list:
        return (
            db.query(models.ReviewLog)
            .order_by(models.ReviewLog.created_at.desc())
            .limit(limit)
            .all()
        )

    # ─── Transaction / Anomaly ────────────────────────────────────────────────

    def create_transaction_log(
        self, db: Session, product_name: str, product_price: float,
        product_category: str, quantity: int, is_anomaly: int
    ) -> models.TransactionLog:
        log = models.TransactionLog(
            product_name=product_name,
            product_price=product_price,
            product_category=product_category,
            quantity=quantity,
            is_anomaly=is_anomaly,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    def get_anomaly_transactions(self, db: Session, limit: int = 50) -> list:
        return (
            db.query(models.TransactionLog)
            .filter(models.TransactionLog.is_anomaly == 1)
            .order_by(models.TransactionLog.created_at.desc())
            .limit(limit)
            .all()
        )

    # ─── Regression / Forecast ────────────────────────────────────────────────

    def create_forecast_log(
        self, db: Session, product_price: float, product_category: str,
        avg_rating: float, predicted_sold_count: float
    ) -> models.SalesForecastLog:
        log = models.SalesForecastLog(
            product_price=product_price,
            product_category=product_category,
            avg_rating=avg_rating,
            predicted_sold_count=predicted_sold_count,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    def get_forecast_history(self, db: Session, limit: int = 30) -> list:
        return (
            db.query(models.SalesForecastLog)
            .order_by(models.SalesForecastLog.created_at.asc())
            .limit(limit)
            .all()
        )

    # ─── Classification ───────────────────────────────────────────────────────

    def create_classification_log(
        self, db: Session, product_price: float, product_category: str,
        avg_rating: float, sold_count: int, is_top_product: int, confidence_score: float
    ) -> models.ClassificationLog:
        log = models.ClassificationLog(
            product_price=product_price,
            product_category=product_category,
            avg_rating=avg_rating,
            sold_count=sold_count,
            is_top_product=is_top_product,
            confidence_score=confidence_score,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log


crud_service = CRUDService()