import axios from "axios";

// ─── 1. ABSTRAKSI: Base API Class ─────────────────────────────
class BaseApi {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Method dasar untuk semua request
  get(endpoint, config = {}) {
    return this.client.get(endpoint, config);
  }

  post(endpoint, data, config = {}) {
    return this.client.post(endpoint, data, config);
  }
}

// ─── 2. INHERITANSI & ENKAPSULASI: ML Service ─────────────────
class MLService extends BaseApi {
  constructor(baseURL) {
    super(baseURL); // Memanggil constructor dari BaseApi
  }

  predictSentiment(reviewText) {
    return this.post("/predict/sentiment", { review_text: reviewText });
  }

  predictRegression(data) {
    return this.post("/predict/regression", data);
  }

  predictClassification(data) {
    return this.post("/predict/classification", data);
  }

  submitTransaction(data) {
    return this.post("/predict/transaction", data);
  }

  predictCluster(productPrice, rating, soldCount) {
    return this.post("/predict/cluster", null, {
      params: { product_price: productPrice, rating, sold_count: soldCount },
    });
  }
}

// ─── 3. INHERITANSI & ENKAPSULASI: Dashboard Service ──────────
class DashboardService extends BaseApi {
  constructor(baseURL) {
    super(baseURL);
  }

  getSentimentStats() {
    return this.get("/dashboard/sentiment/stats");
  }

  getSentimentLogs(limit = 20) {
    return this.get("/dashboard/sentiment/logs", { params: { limit } });
  }

  getAnomalies() {
    return this.get("/dashboard/anomalies");
  }

  getForecastHistory() {
    return this.get("/dashboard/forecast/history");
  }

  getClusterCenters() {
    return this.get("/dashboard/clusters/centers");
  }
}

// ─── 4. INSTANSIASI OBJEK (Singleton Pattern) ─────────────────
const BASE_URL = "https://farhannzz-ecommerce-analytics.hf.space";

export const mlService = new MLService(BASE_URL);
export const dashboardService = new DashboardService(BASE_URL);
