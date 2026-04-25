import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  positif: "#0B6B3A",
  netral: "#F2F1E6",
  negatif: "#B11226",
};

export default function SentimentPieChart({ data }) {
  if (!data || data.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-xl">
        <span className="material-symbols-outlined text-secondary mb-2 opacity-50 text-3xl">
          pie_chart
        </span>
        <p className="text-secondary text-sm font-semibold">
          No sentiment data available
        </p>
      </div>
    );
  }

  const chartData = [
    { name: "Positif", value: data.positif },
    { name: "Netral", value: data.netral },
    { name: "Negatif", value: data.negatif },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Menggunakan ResponsiveContainer agar menyesuaikan ukuran card */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name.toLowerCase()]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontWeight: "bold",
              }}
              itemStyle={{ color: "#000" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant w-full text-center">
        <p className="text-xs font-bold text-secondary uppercase tracking-wider">
          Total Reviews Analyzed:{" "}
          <span className="text-primary">{data.total}</span>
        </p>
      </div>
    </div>
  );
}
