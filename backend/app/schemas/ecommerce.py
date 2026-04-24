from datetime import datetime
from pydantic import BaseModel, Field, field_validator


# ─── Request Schemas ──────────────────────────────────────────────────────────

class SentimentRequest(BaseModel):
    review_text: str = Field(..., min_length=1, max_length=1000)

    @field_validator("review_text")
    @classmethod
    def strip_and_check(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("review_text tidak boleh kosong atau hanya spasi")
        return v


class RegressionRequest(BaseModel):
    product_price: float = Field(..., gt=0, description="Harga harus lebih dari 0")
    product_category: str = Field(..., min_length=1)
    avg_rating: float = Field(..., ge=1.0, le=5.0, description="Rating antara 1.0 - 5.0")


class ClassificationRequest(BaseModel):
    product_price: float = Field(..., gt=0)
    product_category: str = Field(..., min_length=1)
    avg_rating: float = Field(..., ge=1.0, le=5.0)
    sold_count: int = Field(..., ge=0)


class TransactionRequest(BaseModel):
    product_name: str = Field(..., min_length=1)
    product_price: float = Field(..., gt=0)
    product_category: str = Field(..., min_length=1)
    quantity: int = Field(..., ge=1, le=1000)


# ─── Response Schemas ─────────────────────────────────────────────────────────

class SentimentResponse(BaseModel):
    review_text: str
    sentiment_label: str
    confidence_score: float


class RegressionResponse(BaseModel):
    product_price: float
    product_category: str
    avg_rating: float
    predicted_sold_count: float


class ClassificationResponse(BaseModel):
    is_top_product: bool
    confidence_score: float
    label: str  # "Top Product" atau "Standard Product"


class TransactionResponse(BaseModel):
    transaction_id: int
    is_anomaly: bool
    message: str


# ─── Dashboard Schemas ────────────────────────────────────────────────────────

class SentimentStats(BaseModel):
    positif: int
    netral: int
    negatif: int
    total: int


class ReviewLogItem(BaseModel):
    id: int
    review_text: str
    sentiment_label: str
    confidence_score: float | None
    created_at: datetime

    class Config:
        from_attributes = True


class AnomalyItem(BaseModel):
    id: int
    product_name: str
    product_price: float
    quantity: int
    created_at: datetime

    class Config:
        from_attributes = True


class ForecastPoint(BaseModel):
    created_at: datetime
    predicted_sold_count: float

    class Config:
        from_attributes = True