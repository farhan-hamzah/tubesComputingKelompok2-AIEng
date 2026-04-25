export default function AnomalyTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-xl">
        <span className="material-symbols-outlined text-secondary mb-2 opacity-50 text-3xl">
          verified_user
        </span>
        <p className="text-secondary text-sm font-semibold">
          No anomalies detected
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-outline-variant text-secondary uppercase tracking-wider text-xs">
            <th className="p-3 font-bold">ID</th>
            <th className="p-3 font-bold">Product</th>
            <th className="p-3 font-bold">Price</th>
            <th className="p-3 font-bold">Qty</th>
            <th className="p-3 font-bold">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-surface-container transition-colors"
            >
              <td className="p-3 font-semibold text-primary">#{row.id}</td>
              <td className="p-3 text-primary font-medium">
                {row.product_name}
              </td>
              <td className="p-3 text-secondary">
                Rp {row.product_price.toLocaleString("id-ID")}
              </td>
              <td className="p-3">
                <span className="inline-flex items-center gap-1.5 bg-[#fff0f0] text-[#ba1a1a] px-2.5 py-1 rounded-md font-bold text-xs border border-[#ffdad6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                  {row.quantity}
                </span>
              </td>
              <td className="p-3 text-secondary text-xs font-medium">
                {new Date(row.created_at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
