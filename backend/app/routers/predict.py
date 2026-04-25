import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.ecommerce import (
    SentimentRequest, SentimentResponse,
    RegressionRequest, RegressionResponse,
    ClassificationRequest, ClassificationResponse,
    TransactionRequest, TransactionResponse,
)
from app.services.ml_service import ml_service
from app.services.crud_service import crud_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/sentiment", response_model=SentimentResponse)
def predict_sentiment(request: SentimentRequest, db: Session = Depends(get_db)):
    """
    Klasifikasikan sentimen review produk.
    Return: positif / netral / negatif + confidence score.
    """
    try:
        result = ml_service.predict_sentiment(request.review_text)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Sentiment prediction error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")

    crud_service.create_review_log(
        db=db,
        review_text=request.review_text,
        sentiment_label=result["sentiment_label"],
        confidence_score=result["confidence_score"],
    )

    return SentimentResponse(
        review_text=request.review_text,
        sentiment_label=result["sentiment_label"],
        confidence_score=result["confidence_score"],
    )


@router.post("/regression", response_model=RegressionResponse)
def predict_sold_count(request: RegressionRequest, db: Session = Depends(get_db)):
    """
    Prediksi jumlah produk yang akan terjual (sold_count).
    """
    features = {
        "product_price": request.product_price,
        "product_category": request.product_category,
        "avg_rating": request.avg_rating,
    }
    try:
        predicted = ml_service.predict_sold_count(features)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Regression prediction error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")

    crud_service.create_forecast_log(
        db=db,
        product_price=request.product_price,
        product_category=request.product_category,
        avg_rating=request.avg_rating,
        predicted_sold_count=predicted,
    )

    return RegressionResponse(
        product_price=request.product_price,
        product_category=request.product_category,
        avg_rating=request.avg_rating,
        predicted_sold_count=predicted,
    )


@router.post("/classification", response_model=ClassificationResponse)
def predict_top_product(request: ClassificationRequest, db: Session = Depends(get_db)):
    """
    Prediksi apakah suatu produk termasuk top product (is_top_product).
    """
    features = {
        "product_price": request.product_price,
        "product_category": request.product_category,
        "avg_rating": request.avg_rating,
        "sold_count": request.sold_count,
    }
    try:
        result = ml_service.predict_top_product(features)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Classification prediction error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")

    crud_service.create_classification_log(
        db=db,
        product_price=request.product_price,
        product_category=request.product_category,
        avg_rating=request.avg_rating,
        sold_count=request.sold_count,
        is_top_product=int(result["is_top_product"]),
        confidence_score=result["confidence_score"],
    )

    return ClassificationResponse(
        is_top_product=result["is_top_product"],
        confidence_score=result["confidence_score"],
        label="Top Product" if result["is_top_product"] else "Standard Product",
    )


@router.post("/transaction", response_model=TransactionResponse)
def submit_transaction(request: TransactionRequest, db: Session = Depends(get_db)):
    """
    Submit mock transaction. Deteksi anomali via heuristik sederhana
    (nanti bisa diganti model DBSCAN jika tim ML export-nya).
    Anomali = quantity > 100 (indikasi bot purchase).
    """
    is_anomaly = 1 if request.quantity > 100 else 0

    log = crud_service.create_transaction_log(
        db=db,
        product_name=request.product_name,
        product_price=request.product_price,
        product_category=request.product_category,
        quantity=request.quantity,
        is_anomaly=is_anomaly,
    )

    return TransactionResponse(
        transaction_id=log.id,
        is_anomaly=bool(is_anomaly),
        message="Transaksi terdeteksi anomali" if is_anomaly else "Transaksi normal",
    )


@router.post("/cluster")
def predict_cluster(
    product_price: float,
    rating: float,
    sold_count: float,
    db: Session = Depends(get_db)
):
    """
    Segmentasi produk ke cluster KMeans.
    Return: cluster_id + label (Produk Premium / Massal / Gagal).
    """
    try:
        result = ml_service.predict_cluster(product_price, rating, sold_count)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Cluster prediction error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")
    return result