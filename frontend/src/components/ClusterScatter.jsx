import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444"];

export default function ClusterScatter({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Belum ada data cluster.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart>
        <XAxis dataKey="center_price" name="Harga" unit=" Rp" />
        <YAxis dataKey="center_rating" name="Rating" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        {data.map((cluster, i) => (
          <Scatter
            key={cluster.cluster_id}
            name={cluster.cluster_label}
            data={[{ center_price: cluster.center_price, center_rating: cluster.center_rating }]}
            fill={COLORS[i % COLORS.length]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}