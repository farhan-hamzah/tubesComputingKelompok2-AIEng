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

      // Hilangkan notifikasi setelah 3 detik
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("❌ Gagal transaksi");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-[1rem] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group font-manrope relative">
      {/* Gambar Produk */}
      <div className="relative h-[250px] w-full bg-surface-container-low overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge (Opsional, muncul jika data mock memiliki badge) */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.badge === "SALE" ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary"}`}
          >
            {product.badge}
          </div>
        )}
      </div>

      {/* Detail Produk */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold text-on-surface line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="text-lg font-bold text-primary whitespace-nowrap">
            Rp {product.price.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="flex items-center space-x-1 mb-5">
          <span
            className="material-symbols-outlined text-primary text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-sm font-medium text-secondary">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Notifikasi Transaksi (Muncul sementara saat beli) */}
        {status && (
          <div className="mb-2 text-center text-xs font-bold">{status}</div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex space-x-3">
          <button
            onClick={onSelect}
            className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface py-2 rounded-full text-sm font-bold hover:bg-gray-200 hover:scale-[1.02] transition-all"
          >
            Review
          </button>
          <button
            onClick={handleBuy}
            className="flex-1 bg-primary text-on-primary py-2 rounded-full text-sm font-bold shadow-md hover:bg-green-500 hover:scale-[1.02] transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
