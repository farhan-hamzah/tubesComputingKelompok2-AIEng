import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.ecommerce import (
    SentimentRequest, SentimentResponse,
    RegressionRequest, RegressionResponse,
    ClassificationRequest, ClassificationResponse,
    ClusterRequest, ClusterResponse,
    TransactionRequest, TransactionResponse,
)
from app.services.ml_service import ml_service
from app.services.crud_service import crud_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/sentiment", response_model=SentimentResponse)
def predict_sentiment(request: SentimentRequest, db: Session = Depends(get_db)):
    """Klasifikasi tipe review: Transactional / Transitional / Communal."""
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
    """Prediksi jumlah terjual (Number Sold) berdasarkan Category, Price, Overall Rating."""
    features = {
        "Category": request.Category,
        "Price": request.Price,
        "Overall Rating": request.Overall_Rating,
    }
    try:
        predicted = ml_service.predict_sold_count(features)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Regression error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")

    crud_service.create_forecast_log(
        db=db,
        product_price=request.Price,
        product_category=request.Category,
        avg_rating=request.Overall_Rating,
        predicted_sold_count=predicted,
    )

    return RegressionResponse(
        Category=request.Category,
        Price=request.Price,
        Overall_Rating=request.Overall_Rating,
        predicted_number_sold=predicted,
    )


@router.post("/classification", response_model=ClassificationResponse)
def predict_top_product(request: ClassificationRequest, db: Session = Depends(get_db)):
    """Prediksi apakah produk best seller berdasarkan Category, Location, Price."""
    features = {
        "Category": request.Category,
        "Location": request.Location,
        "Price": request.Price,
    }
    try:
        result = ml_service.predict_top_product(features)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")

    crud_service.create_classification_log(
        db=db,
        product_price=request.Price,
        product_category=request.Category,
        avg_rating=0.0,
        sold_count=0,
        is_top_product=int(result["is_top_product"]),
        confidence_score=result["confidence_score"],
    )

    return ClassificationResponse(
        is_top_product=result["is_top_product"],
        confidence_score=result["confidence_score"],
        label="Best Seller" if result["is_top_product"] else "Bukan Best Seller",
    )


@router.post("/cluster", response_model=ClusterResponse)
def predict_cluster(request: ClusterRequest):
    """Segmentasi produk: Premium / Massal / Tidak layak."""
    try:
        result = ml_service.predict_cluster(
            price=request.Price,
            overall_rating=request.Overall_Rating,
            number_sold=request.Number_Sold,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Cluster error: {e}")
        raise HTTPException(status_code=500, detail="Inference error")

    return ClusterResponse(**result)


@router.post("/transaction", response_model=TransactionResponse)
def submit_transaction(request: TransactionRequest, db: Session = Depends(get_db)):
    """Submit mock transaction. Quantity > 100 dianggap anomali."""
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