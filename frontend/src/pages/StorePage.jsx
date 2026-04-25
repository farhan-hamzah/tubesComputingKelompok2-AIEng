import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ReviewForm from "../components/ReviewForm";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Acoustic Noise Cancelling Headphones",
    price: 2990000,
    category: "Electronics",
    rating: 4.8,
    reviews: 124,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Minimalist Smart Watch V2",
    price: 1990000,
    category: "Electronics",
    rating: 4.5,
    reviews: 89,
    badge: "SALE",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Nordic Digital Desk Clock",
    price: 450000,
    category: "Home",
    rating: 4.2,
    reviews: 34,
    image:
      "https://images.unsplash.com/photo-1493135637657-c2411b3497ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Artisan Ceramic Pour-Over",
    price: 680000,
    category: "Kitchen",
    rating: 4.9,
    reviews: 210,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Handcrafted Leather Journal",
    price: 350000,
    category: "Stationery",
    rating: 4.7,
    reviews: 56,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Insulated Stainless Bottle",
    price: 400000,
    category: "Sports",
    rating: 4.6,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  },
];

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProduct]);

  return (
    <div className="bg-background text-on-background min-h-screen relative">
      <main className="max-w-[1280px] mx-auto px-6 py-16">
        {/* Header Title*/}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-on-primary-container uppercase tracking-widest mb-2">
              <span>Home</span>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              <span className="text-primary">Shop</span>
            </nav>
            <h1 className="text-5xl font-[800] text-primary tracking-[-0.05em] leading-tight">
              All Products
            </h1>
          </div>

          <div className="text-sm font-bold text-on-primary-container mt-4 md:mt-0 bg-gray-100 px-4 py-2 rounded-full border border-outline-variant">
            Showing 1-6 of 45 results
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-20 flex justify-center items-center space-x-3">
          <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all duration-300">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold shadow-xl scale-110">
            1
          </button>
          <button className="w-12 h-12 rounded-full border border-transparent flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors text-sm font-bold">
            2
          </button>
          <button className="w-12 h-12 rounded-full border border-transparent flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors text-sm font-bold">
            3
          </button>
          <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all duration-300">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* POPUP MODAL REVIEW */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProduct(null)}
          ></div>

          {/* Modal Content*/}
          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header - Menggunakan bg-gray-50 sebagai pengganti bg-surface-bright agar ada kontras sedikit namun tetap solid */}
            <div className="flex justify-between items-center p-6 border-b border-outline-variant bg-gray-50">
              <h2 className="text-xl font-extrabold tracking-tight text-primary">
                Tulis Ulasan Produk
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="material-symbols-outlined p-2 hover:bg-error-container hover:text-on-error-container rounded-full transition-colors"
              >
                close
              </button>
            </div>

            <div className="p-8">
              {/* Info Produk */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-100 rounded-2xl border border-outline-variant">
                <img
                  src={selectedProduct.image}
                  className="w-16 h-16 object-cover rounded-xl shadow-sm"
                  alt=""
                />
                <div>
                  <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest">
                    {selectedProduct.category}
                  </p>
                  <h3 className="text-lg font-bold text-primary leading-tight">
                    {selectedProduct.name}
                  </h3>
                </div>
              </div>
              {/* Form Ulasan */}
              <ReviewForm selectedProduct={selectedProduct} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
