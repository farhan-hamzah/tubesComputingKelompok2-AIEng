import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import StorePage from "./pages/StorePage";
import DashboardPage from "./pages/DashboardPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function Navbar() {
  const location = useLocation();
  const linkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
    ${
      location.pathname === path
        ? "bg-primary text-on-primary shadow-lg"
        : "text-secondary hover:bg-gray-100"
    }
  `;

  return (
    <nav className="bg-white border-b border-outline-variant px-8 py-4 flex justify-between items-center sticky top-0 z-50 font-manrope">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter text-primary italic"
        >
          SmartStore.
        </Link>
        <div className="flex gap-2">
          <Link to="/" className={linkClass("/")}>
            Toko
          </Link>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard Admin
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined p-2 cursor-pointer">
          search
        </span>
        <span className="material-symbols-outlined p-2 cursor-pointer">
          shopping_bag
        </span>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-manrope">
        <Navbar />
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
