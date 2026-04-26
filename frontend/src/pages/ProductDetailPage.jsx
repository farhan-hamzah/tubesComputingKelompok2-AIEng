import { useParams, Link } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        ← Kembali ke Toko
      </Link>
      <div className="mt-4 bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">Detail Produk #{id}</h1>
        <p className="text-gray-500 mt-2">Halaman detail produk akan dikembangkan lebih lanjut.</p>
      </div>
    </div>
  );
}