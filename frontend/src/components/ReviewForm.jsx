import { useState } from "react";
import { mlService } from "../api/client";

export default function ReviewForm({ selectedProduct }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) { setError("Review tidak boleh kosong"); return; }
    if (text.length > 1000) { setError("Maksimal 1000 karakter"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await mlService.predictSentiment(text);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal analisis sentimen");
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor = {
    positif: "text-green-600",
    netral: "text-yellow-500",
    negatif: "text-red-500",
  };

  const sentimentEmoji = {
    positif: "😊",
    netral: "😐",
    negatif: "😞",
  };

  return (
    <div>
      {selectedProduct && (
        <p className="text-sm text-gray-500 mb-3">
          Ulasan untuk:{" "}
          <span className="font-semibold">{selectedProduct.name}</span>
        </p>
      )}
      <textarea
        className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={4}
        placeholder="Tulis ulasan produk kamu di sini..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-1 mb-3">
        <span className="text-xs text-gray-400">{text.length}/1000</span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold"
      >
        {loading ? "Menganalisis..." : "Submit Ulasan"}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Hasil Analisis Sentimen:</p>
          <p className={`text-xl font-bold capitalize ${sentimentColor[result.sentiment_label]}`}>
            {sentimentEmoji[result.sentiment_label]} {result.sentiment_label}
          </p>
          <p className="text-xs text-gray-400">
            Confidence: {(result.confidence_score * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}