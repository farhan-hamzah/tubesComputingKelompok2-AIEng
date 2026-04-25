import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StorePage from "./pages/StorePage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-900 text-white px-6 py-4 flex gap-6">
        <Link to="/" className="font-bold text-lg hover:text-blue-400">
          🛍️ Toko
        </Link>
        <Link to="/dashboard" className="font-bold text-lg hover:text-blue-400">
          📊 Dashboard Admin
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}