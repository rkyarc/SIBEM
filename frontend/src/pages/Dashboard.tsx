export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 1. Filter Responsif: Tambah flex-wrap dan sesuaikan margin/gap */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
        <div className="flex-1 min-w-[200px] flex items-center bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-gray-300 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Cari kegiatan..."
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>
        <select className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 text-sm shadow-sm">
          <option>Semua Status</option>
        </select>
        <select className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 text-sm shadow-sm">
          <option>Semua Periode</option>
        </select>
        <select className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 text-sm shadow-sm">
          <option>Semua Kementerian</option>
        </select>
        <button className="px-6 py-2.5 bg-[#FBBF24] hover:bg-yellow-500 text-white rounded-xl font-medium transition text-sm shadow-sm w-full sm:w-auto">
          Hapus Filter
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kiri (Lebar) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Distribusi Status */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800">Distribusi Status Kegiatan</h3>
              <div className="text-right">
                <p className="text-xl md:text-3xl font-bold text-[#3B82F6]">$ 2850.75</p>
                <p className="text-xs text-gray-400 mb-2">Current balance</p>
                <p className="text-sm font-bold text-[#10B981]">$ 1500.50</p>
                <p className="text-xs text-gray-400 mb-2">Income</p>
                <p className="text-sm font-bold text-[#EF4444]">$ 350.60</p>
                <p className="text-xs text-gray-400">Outcome</p>
              </div>
            </div>
            {/* Visualisasi Placeholder */}
            <div className="mt-8 flex items-center justify-between">
               <div className="w-1/2">
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className="bg-[#3B82F6] h-2 rounded-full w-1/4"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Weekly limit</span>
                    <span>$350 / $4000</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="hidden sm:inline">Deactivate</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
               </div>
            </div>
          </div>

          {/* Tabel Kegiatan Terbaru */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-4">Kegiatan Terbaru</h3>
            {/* 2. Tabel Responsif: Bungkus dengan overflow-x-auto */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm text-left">
                <thead className="text-xs text-gray-400">
                  <tr>
                    <th className="py-2 font-normal">Nama Kegiatan</th>
                    <th className="py-2 font-normal">Status</th>
                    <th className="py-2 font-normal">Tanggal</th>
                    <th className="py-2 font-normal text-right">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-50">
                    <td className="py-4 font-medium flex items-center gap-3">
                      <span className="text-gray-400">🛒</span> Seminar Nasional
                    </td>
                    <td className="py-4 text-gray-400">Menunggu</td>
                    <td className="py-4 text-gray-400">24 Mei 2026</td>
                    <td className="py-4 font-bold text-right text-gray-800">09.00 WIB</td>
                  </tr>
                  <tr className="border-t border-gray-50">
                    <td className="py-4 font-medium flex items-center gap-3">
                      <span className="text-gray-400">🚚</span> ElectroMen Market
                    </td>
                    <td className="py-4 text-gray-400">Disetujui</td>
                    <td className="py-4 text-gray-400">14 Juni 2026</td>
                    <td className="py-4 font-bold text-right text-gray-800">10.00 WIB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kanan (Sempit) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 3. Grid Angka Responsif: grid-cols-2 di HP, grid-cols-3 di Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-light text-gray-600">36</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-gray-500">
                <span className="text-blue-500 bg-blue-50 p-1 rounded-md">🏛️</span> Total Proker
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-light text-gray-600">31</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-gray-500">
                <span className="text-orange-500 bg-orange-50 p-1 rounded-md">📋</span> Selesai
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-light text-gray-600">5</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-gray-500 leading-tight">
                <span className="text-yellow-500 bg-yellow-50 p-1 rounded-md">🎮</span> Menunggu
              </div>
            </div>
          </div>

          {/* Progress Kegiatan */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-6">Progress Kegiatan</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium flex items-center gap-2 text-gray-600">
                    <span className="text-orange-400">🛒</span> Seminar Nasional
                  </span>
                  <span className="text-xs font-bold text-gray-600">52%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">🚚</span> Pelatihan Leadership
                  </span>
                  <span className="text-xs font-bold text-gray-600">21%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '21%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium flex items-center gap-2 text-gray-600">
                    <span className="text-blue-400">✈️</span> Rapat Kerja BEM
                  </span>
                  <span className="text-xs font-bold text-gray-600">74%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Placeholder Approval Terbaru */}
          <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100 h-32 relative overflow-hidden">
             <div className="absolute right-[-20px] bottom-[-20px] bg-red-400 w-24 h-24 rounded-3xl opacity-80 rotate-12"></div>
             <h3 className="font-bold text-red-800 text-sm relative z-10">Approval Terbaru</h3>
             <div className="mt-2 bg-white p-3 rounded-xl flex justify-between items-center relative z-10 border border-red-100">
                <div>
                   <p className="text-xs font-bold text-gray-800">Surat Izin Kegiatan</p>
                   <p className="text-[10px] text-gray-400">Div. PSDM</p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded">Disetujui</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}