import { useEffect, useState } from "react";
import SentimentPieChart from "../components/SentimentPieChart";
import AnomalyTable from "../components/AnomalyTable";
import ForecastChart from "../components/ForecastChart";
import ClusterScatter from "../components/ClusterScatter";
import {
  getSentimentStats,
  getAnomalies,
  getForecastHistory,
  getClusterCenters,
} from "../api/client";

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
          getSentimentStats(),
          getAnomalies(),
          getForecastHistory(),
          getClusterCenters(),
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
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widget 1 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-3">Widget 1 — Distribusi Sentimen</h2>
          <SentimentPieChart data={sentimentStats} />
        </div>

        {/* Widget 2 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-3">Widget 2 — Fraud Alert</h2>
          <AnomalyTable data={anomalies} />
        </div>

        {/* Widget 3 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-3">Widget 3 — Sales Forecast</h2>
          <ForecastChart data={forecastHistory} />
        </div>

        {/* Widget 4 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-3">Widget 4 — Product Segmentation</h2>
          <ClusterScatter data={clusterCenters} />
        </div>
      </div>
    </div>
  );
}