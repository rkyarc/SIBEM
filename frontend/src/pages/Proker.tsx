import { useState } from "react";

const Proker = () => {
  const [daftarKegiatan] = useState([
    { id: "K-001", nama: "LKMM-TD", departemen: "PSDM", status: "Selesai" },
    {
      id: "K-002",
      nama: "BEM UISI Expo",
      departemen: "Humas",
      status: "Disetujui",
    },
    {
      id: "K-003",
      nama: "Seminar Teknologi",
      departemen: "Keilmuan",
      status: "Menunggu Validasi",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Disetujui":
        return "bg-blue-100 text-blue-800";
      case "Menunggu Validasi":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Program Kerja
          </h1>
          <p className="text-gray-500">
            Kelola pengajuan dan pelaksanaan proker BEM.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
          + Tambah Proker
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Nama Kegiatan
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Departemen
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {daftarKegiatan.map((kegiatan) => (
              <tr
                key={kegiatan.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="p-4 text-sm text-gray-700 font-medium">
                  {kegiatan.id}
                </td>
                <td className="p-4 text-sm text-gray-800">{kegiatan.nama}</td>
                <td className="p-4 text-sm text-gray-600">
                  {kegiatan.departemen}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      kegiatan.status
                    )}`}
                  >
                    {kegiatan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proker;