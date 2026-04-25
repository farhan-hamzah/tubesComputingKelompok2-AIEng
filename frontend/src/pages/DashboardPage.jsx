import { useEffect, useState } from "react";
import SentimentPieChart from "../components/SentimentPieChart";
import AnomalyTable from "../components/AnomalyTable";
import ForecastChart from "../components/ForecastChart";
import ClusterScatter from "../components/ClusterScatter";
import { dashboardService } from "../api/client";

export default function DashboardPage() {
  const [sentimentStats, setSentimentStats] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [forecastHistory, setForecastHistory] = useState([]);
  const [clusterCenters, setClusterCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, a, f, c] = await Promise.all([
          dashboardService.getSentimentStats(),
          dashboardService.getAnomalies(),
          dashboardService.getForecastHistory(),
          dashboardService.getClusterCenters(),
        ]);
        setSentimentStats(s.data);
        setAnomalies(a.data);
        setForecastHistory(f.data);
        setClusterCenters(c.data.clusters || []);
      } catch (err) {
        console.error("Gagal fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-secondary font-manrope">
        <span className="material-symbols-outlined animate-spin mr-2">
          sync
        </span>
        Memuat data sistem...
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-manrope">
      <main className="max-w-[1280px] mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-outline-variant pb-6">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-on-primary-container uppercase tracking-widest mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              <span className="text-primary">Console</span>
            </nav>
            <h1 className="text-4xl font-[800] text-primary tracking-[-0.05em] leading-tight">
              System Dashboard
            </h1>
          </div>
          <div className="text-sm font-bold text-on-primary-container mt-4 md:mt-0 flex gap-4">
            <button className="flex items-center gap-2 border border-outline-variant px-4 py-2 rounded-full hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>{" "}
              Export Report
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget 1: Sentiment */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                Sentiment Overview
              </h2>
              <span className="material-symbols-outlined text-secondary">
                mood
              </span>
            </div>
            <SentimentPieChart data={sentimentStats} />
          </div>

          {/* Widget 3: Sales Forecast */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                Sales Forecasting
              </h2>
              <span className="material-symbols-outlined text-secondary">
                trending_up
              </span>
            </div>
            <ForecastChart data={forecastHistory} />
          </div>

          {/* Widget 2: Fraud Alert  */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-primary">
                  Anomaly Detection
                </h2>
                {anomalies.length > 0 && (
                  <span className="bg-error text-on-error text-xs px-2 py-0.5 rounded-full font-bold">
                    {anomalies.length} Alerts
                  </span>
                )}
              </div>
              <span className="material-symbols-outlined text-secondary">
                security
              </span>
            </div>
            <AnomalyTable data={anomalies} />
          </div>

          {/* Widget 4: Product Segmentation */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant lg:col-span-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                Product Segments
              </h2>
              <span className="material-symbols-outlined text-secondary">
                scatter_plot
              </span>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <ClusterScatter data={clusterCenters} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
