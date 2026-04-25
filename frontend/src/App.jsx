import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import StorePage from "./pages/StorePage";
import DashboardPage from "./pages/DashboardPage";

function Navbar() {
  const location = useLocation();

  const linkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
    ${
      location.pathname === path
        ? "bg-primary text-on-primary shadow-md"
        : "text-secondary hover:bg-surface-container-high hover:text-on-surface"
    }
  `;

  return (
    <nav className="bg-white border-b border-outline-variant px-8 py-4 flex justify-between items-center sticky top-0 z-50 font-manrope">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tighter text-primary"
        >
          SmartStore.
        </Link>
        <div className="flex gap-2">
          <Link to="/" className={linkClass("/")}>
            <span className="material-symbols-outlined text-[20px]">
              storefront
            </span>
            Toko
          </Link>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <span className="material-symbols-outlined text-[20px]">
              dashboard
            </span>
            Dashboard Admin
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-on-surface p-2 hover:bg-surface-container rounded-full transition-colors">
          search
        </button>
        <button className="material-symbols-outlined text-on-surface p-2 hover:bg-surface-container rounded-full transition-colors">
          shopping_bag
        </button>
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
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
