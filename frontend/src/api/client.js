import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Prediction ───────────────────────────────────────────────
export const predictSentiment = (reviewText) =>
  apiClient.post("/predict/sentiment", { review_text: reviewText });

export const predictRegression = (data) =>
  apiClient.post("/predict/regression", data);

export const predictClassification = (data) =>
  apiClient.post("/predict/classification", data);

export const submitTransaction = (data) =>
  apiClient.post("/predict/transaction", data);

export const predictCluster = (productPrice, rating, soldCount) =>
  apiClient.post("/predict/cluster", null, {
    params: { product_price: productPrice, rating, sold_count: soldCount },
  });

// ─── Dashboard ────────────────────────────────────────────────
export const getSentimentStats = () =>
  apiClient.get("/dashboard/sentiment/stats");

export const getSentimentLogs = (limit = 20) =>
  apiClient.get("/dashboard/sentiment/logs", { params: { limit } });

export const getAnomalies = () =>
  apiClient.get("/dashboard/anomalies");

export const getForecastHistory = () =>
  apiClient.get("/dashboard/forecast/history");

export const getClusterCenters = () =>
  apiClient.get("/dashboard/clusters/centers");