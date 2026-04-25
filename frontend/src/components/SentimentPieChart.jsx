import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = { positif: "#22c55e", netral: "#eab308", negatif: "#ef4444" };

export default function SentimentPieChart({ data }) {
  if (!data || data.total === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Belum ada data sentimen.</p>;
  }

  const chartData = [
    { name: "Positif", value: data.positif },
    { name: "Netral", value: data.netral },
    { name: "Negatif", value: data.negatif },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col items-center">
      <PieChart width={300} height={250}>
        <Pie data={chartData} cx={150} cy={110} outerRadius={90} dataKey="value" label>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <p className="text-xs text-gray-400">Total review: {data.total}</p>
    </div>
  );
}