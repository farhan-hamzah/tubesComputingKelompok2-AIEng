import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ForecastChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-xl">
        <span className="material-symbols-outlined text-secondary mb-2 opacity-50 text-3xl">
          show_chart
        </span>
        <p className="text-secondary text-sm font-semibold">
          No forecast data available
        </p>
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    index: i + 1,
    predicted: Math.round(d.predicted_sold_count),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e2e2"
        />
        <XAxis
          dataKey="index"
          tick={{ fill: "#848484", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e2e2e2" }}
        />
        <YAxis
          tick={{ fill: "#848484", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e2e2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontWeight: "bold",
          }}
          itemStyle={{ color: "#1a1c1c" }}
          labelStyle={{ color: "#848484", marginBottom: "4px" }}
          formatter={(v) => [`${v} unit`, "Prediksi Terjual"]}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#1a1c1c"
          strokeWidth={3}
          dot={{ r: 4, fill: "#1a1c1c", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#1a1c1c", stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
