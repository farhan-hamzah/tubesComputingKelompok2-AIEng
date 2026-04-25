export default function AnomalyTable({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Tidak ada transaksi anomali.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-red-50 text-red-700">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Produk</th>
            <th className="p-2 text-left">Harga</th>
            <th className="p-2 text-left">Qty</th>
            <th className="p-2 text-left">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-red-100">
              <td className="p-2">{row.id}</td>
              <td className="p-2">{row.product_name}</td>
              <td className="p-2">Rp {row.product_price.toLocaleString("id-ID")}</td>
              <td className="p-2 text-red-600 font-bold">{row.quantity}</td>
              <td className="p-2 text-gray-400">
                {new Date(row.created_at).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}