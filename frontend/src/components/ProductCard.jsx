import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-[2rem] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant overflow-hidden flex flex-col group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 font-manrope"
    >
      {/* Visual Image */}
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
        {/* Title and Price */}
        <div className="mb-6">
          <h3 className="font-[800] text-xl text-primary leading-tight line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="font-bold text-lg text-secondary">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Footer: Rating & Buy Now Button */}
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
            className="border-2 border-primary text-primary bg-white px-6 py-2 rounded-full font-bold hover:bg-black hover:text-white transition-colors duration-300 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
