import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ReviewForm from "../components/ReviewForm";

const MOCK_PRODUCTS = [
  { id: 1, name: "Sepatu Lari Pro", price: 450000, category: "Fashion", rating: 4.5, image: "👟" },
  { id: 2, name: "Headphone Wireless", price: 350000, category: "Electronics", rating: 4.2, image: "🎧" },
  { id: 3, name: "Botol Minum 1L", price: 85000, category: "Sports", rating: 3.8, image: "🍶" },
  { id: 4, name: "Buku Python Dasar", price: 120000, category: "Books", rating: 4.7, image: "📘" },
];

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🛍️ Simulasi Toko E-Commerce</h1>

      {/* Katalog Produk */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Katalog Produk</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* Form Ulasan */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">✍️ Tulis Ulasan Produk</h2>
        <ReviewForm selectedProduct={selectedProduct} />
      </section>
    </div>
  );
}