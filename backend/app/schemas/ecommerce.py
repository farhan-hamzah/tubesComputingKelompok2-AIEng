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
    Category: str = Field(..., min_length=1)
    Price: float = Field(..., gt=0)
    Overall_Rating: float = Field(..., ge=1.0, le=5.0, alias="Overall Rating")

    class Config:
        populate_by_name = True


class ClassificationRequest(BaseModel):
    Category: str = Field(..., min_length=1)
    Location: str = Field(..., min_length=1)
    Price: float = Field(..., gt=0)


class ClusterRequest(BaseModel):
    Price: float = Field(..., gt=0)
    Overall_Rating: float = Field(..., ge=1.0, le=5.0)
    Number_Sold: float = Field(..., ge=0)


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
    Category: str
    Price: float
    Overall_Rating: float
    predicted_number_sold: float


class ClassificationResponse(BaseModel):
    is_top_product: bool
    confidence_score: float
    label: str


class ClusterResponse(BaseModel):
    cluster_id: int
    cluster_label: str


class TransactionResponse(BaseModel):
    transaction_id: int
    is_anomaly: bool
    message: str


# ─── Dashboard Schemas ────────────────────────────────────────────────────────

class SentimentStats(BaseModel):
    Transactional: int
    Transitional: int
    Communal: int
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