from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.ecommerce import (
    SentimentStats, ReviewLogItem, AnomalyItem, ForecastPoint
)
from app.services.crud_service import crud_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/sentiment/stats", response_model=SentimentStats)
def get_sentiment_stats(db: Session = Depends(get_db)):
    """Distribusi sentimen untuk pie chart Widget 1."""
    return crud_service.get_sentiment_stats(db)


@router.get("/sentiment/logs", response_model=list[ReviewLogItem])
def get_recent_reviews(limit: int = 20, db: Session = Depends(get_db)):
    """Log review terbaru untuk tabel dashboard."""
    return crud_service.get_recent_reviews(db, limit=limit)


@router.get("/anomalies", response_model=list[AnomalyItem])
def get_anomaly_transactions(limit: int = 50, db: Session = Depends(get_db)):
    """Daftar transaksi anomali untuk Widget 2 (Fraud Alert)."""
    return crud_service.get_anomaly_transactions(db, limit=limit)


@router.get("/forecast/history", response_model=list[ForecastPoint])
def get_forecast_history(limit: int = 30, db: Session = Depends(get_db)):
    """Histori prediksi sold_count untuk Widget 3 (line chart)."""
    return crud_service.get_forecast_history(db, limit=limit)