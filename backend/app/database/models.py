from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database.connection import Base


class ReviewLog(Base):
    """
    Menyimpan setiap review yang diklasifikasikan sentimen-nya.
    Dipakai untuk Widget 1 (pie chart sentimen) dan tabel log.
    """
    __tablename__ = "review_logs"

    id = Column(Integer, primary_key=True, index=True)
    review_text = Column(Text, nullable=False)
    sentiment_label = Column(String(20), nullable=False)   # positif / netral / negatif
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class TransactionLog(Base):
    """
    Menyimpan setiap transaksi (mock purchase) beserta flag anomali dari DBSCAN.
    Dipakai untuk Widget 2 (Fraud Alert).
    """
    __tablename__ = "transaction_logs"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    product_price = Column(Float, nullable=False)
    product_category = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    is_anomaly = Column(Integer, default=0)  # 0 = normal, 1 = anomali
    created_at = Column(DateTime, default=datetime.utcnow)


class SalesForecastLog(Base):
    """
    Menyimpan hasil prediksi sold_count dari model regresi.
    Dipakai untuk Widget 3 (Sales Forecast line chart).
    """
    __tablename__ = "sales_forecast_logs"

    id = Column(Integer, primary_key=True, index=True)
    product_price = Column(Float, nullable=False)
    product_category = Column(String(100), nullable=False)
    avg_rating = Column(Float, nullable=False)
    predicted_sold_count = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ClassificationLog(Base):
    """
    Menyimpan hasil prediksi is_top_product dari model klasifikasi.
    """
    __tablename__ = "classification_logs"

    id = Column(Integer, primary_key=True, index=True)
    product_price = Column(Float, nullable=False)
    product_category = Column(String(100), nullable=False)
    avg_rating = Column(Float, nullable=False)
    sold_count = Column(Integer, nullable=False)
    is_top_product = Column(Integer, nullable=False)  # 0 atau 1
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)