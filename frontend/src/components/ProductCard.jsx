import { useState } from "react";
import { mlService } from "../api/client";

export default function ProductCard({ product, onSelect }) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");

  const handleBuy = async (e) => {
    e.stopPropagation();
    try {
      const res = await mlService.submitTransaction({
        product_name: product.name,
        product_price: product.price,
        product_category: product.category,
        quantity: quantity,
      });
      const { is_anomaly, message } = res.data;
      setStatus(is_anomaly ? `⚠️ ${message}` : `✅ ${message}`);
    } catch {
      setStatus("❌ Gagal submit transaksi");
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="bg-white rounded-[2rem] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant overflow-hidden flex flex-col group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 font-manrope"
    >
      <div className="h-[280px] overflow-hidden bg-surface-container-low relative">
        <img
          src={product.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={product.name}
        />
        {product.badge && (
          <div className="absolute top-5 left-5 bg-primary text-on-primary text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-[800] text-xl text-primary leading-tight line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="font-bold text-lg text-secondary">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Input Quantity */}
        <div
          className="flex items-center gap-2 mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="text-sm font-semibold text-gray-600">Qty:</label>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={1000}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border border-gray-300 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(1000, q + 1))}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
          {quantity > 100 && (
            <span className="text-xs text-red-500 font-bold">⚠️ Anomali</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-primary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-base font-extrabold text-primary">
              {product.rating}
            </span>
          </div>

          <button
            type="button"
            className="border-2 border-primary text-primary bg-white px-6 py-2 rounded-full font-bold hover:bg-black hover:text-white transition-colors duration-300 shadow-sm"
            onClick={handleBuy}
          >
            Buy Now
          </button>
        </div>

        {status && (
          <p className="text-xs text-center mt-3 font-semibold">{status}</p>
        )}
      </div>
    </div>
  );
}