import { useState } from "react";
import { mlService } from "../api/client";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Kitchen", "Sports", "Stationery", "Books"];

export default function ForecastForm({ onSuccess }) {
  const [form, setForm] = useState({
    Category: "Electronics",
    Price: "",
    Overall_Rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.Price || !form.Overall_Rating) {
      setError("Semua field harus diisi");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await mlService.predictRegression({
        Category: form.Category,
        Price: parseFloat(form.Price),
        "Overall Rating": parseFloat(form.Overall_Rating),
      });
      setResult(res.data);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal prediksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-sm font-semibold text-gray-600 mb-3">Prediksi Jumlah Terjual</p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Kategori</label>
          <select
            value={form.Category}
            onChange={(e) => setForm({ ...form, Category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Harga (Rp)</label>
          <input
            type="number"
            placeholder="350000"
            value={form.Price}
            onChange={(e) => setForm({ ...form, Price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Rating (1-5)</label>
          <input
            type="number"
            placeholder="4.5"
            min="1"
            max="5"
            step="0.1"
            value={form.Overall_Rating}
            onChange={(e) => setForm({ ...form, Overall_Rating: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Memprediksi..." : "Prediksi Penjualan"}
      </button>

      {result && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">Prediksi terjual:</p>
          <p className="text-2xl font-black text-blue-600">
            {Math.round(result.predicted_number_sold).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-400">unit</p>
        </div>
      )}
    </div>
  );
}