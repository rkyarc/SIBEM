const Dashboard = () => {
  // Ringkasan data (Dummy)
  const stats = [
    { title: 'Total Kegiatan', count: 24, color: 'bg-blue-500' },
    { title: 'Menunggu Validasi', count: 5, color: 'bg-yellow-500' },
    { title: 'Disetujui', count: 12, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Utama</h1>
        <p className="text-gray-500">Selamat datang di sistem manajemen BEM.</p>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.color} flex-shrink-0`}></div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">Pilih menu navigasi di sebelah kiri untuk mengelola data detail.</p>
      </div>
    </div>
  );
};

export default Dashboard;