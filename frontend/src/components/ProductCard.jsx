import { mlService } from "../api/client";
import { useState } from "react";

export default function ProductCard({ product, onSelect }) {
  const [status, setStatus] = useState("");

  const handleBuy = async () => {
    try {
      const res = await mlService.submitTransaction({
        product_name: product.name,
        product_price: product.price,
        product_category: product.category,
        quantity: 1,
      });
      const { is_anomaly, message } = res.data;
      setStatus(is_anomaly ? `⚠️ ${message}` : `✅ ${message}`);
    } catch {
      setStatus("❌ Gagal submit transaksi");
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-md transition"
      onClick={onSelect}
    >
      <div className="text-5xl">{product.image}</div>
      <p className="font-semibold text-gray-800 text-center">{product.name}</p>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-blue-600 font-bold">
        Rp {product.price.toLocaleString("id-ID")}
      </p>
      <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleBuy();
        }}
        className="mt-2 w-full bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700 text-sm"
      >
        Beli Sekarang
      </button>
      {status && <p className="text-xs text-center mt-1">{status}</p>}
    </div>
  );
}
