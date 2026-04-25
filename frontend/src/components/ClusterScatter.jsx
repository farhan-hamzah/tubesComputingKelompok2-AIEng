import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0B6B3A", "#F9C74F", "#B11226"];

export default function ClusterScatter({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-xl w-full">
        <span className="material-symbols-outlined text-secondary mb-2 opacity-50 text-3xl">
          scatter_plot
        </span>
        <p className="text-secondary text-sm font-semibold">
          No cluster data available
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" />
        <XAxis
          type="number"
          dataKey="center_price"
          name="Harga"
          unit=" Rp"
          tick={{ fill: "#848484", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e2e2e2" }}
        />
        <YAxis
          type="number"
          dataKey="center_rating"
          name="Rating"
          tick={{ fill: "#848484", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "#848484" }}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e2e2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontWeight: "bold",
            color: "#1a1c1c",
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#4c4546",
          }}
        />
        {data.map((cluster, i) => (
          <Scatter
            key={cluster.cluster_id}
            name={cluster.cluster_label}
            data={[
              {
                center_price: cluster.center_price,
                center_rating: cluster.center_rating,
              },
            ]}
            fill={COLORS[i % COLORS.length]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
