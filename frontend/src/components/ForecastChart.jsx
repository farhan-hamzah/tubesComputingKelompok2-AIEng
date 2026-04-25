import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ForecastChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Belum ada data forecast.</p>;
  }

  const chartData = data.map((d, i) => ({
    index: i + 1,
    predicted: Math.round(d.predicted_sold_count),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" label={{ value: "Prediksi ke-", position: "insideBottom", offset: -2 }} />
        <YAxis />
        <Tooltip formatter={(v) => [`${v} unit`, "Prediksi Terjual"]} />
        <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}