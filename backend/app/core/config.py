from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/ecommerce_db"

    # Model paths
    NLP_MODEL_DIR: str = "models/indobert"
    REGRESSION_MODEL_PATH: str = "models/regression.pkl"
    CLASSIFICATION_MODEL_PATH: str = "models/classification.pkl"
    KMEANS_MODEL_PATH: str = "models/kmeans_model.pkl"      # tambah ini
    SCALER_MODEL_PATH: str = "models/scaler.pkl"            # tambah ini

    # App
    APP_TITLE: str = "E-Commerce Analytics API"
    APP_VERSION: str = "1.0.0"
    MAX_REVIEW_LENGTH: int = 1000

    class Config:
        env_file = ".env"


settings = Settings()