import { useState } from "react";

// --- Komponen Bantuan untuk Ikon (Menggunakan SVG Bawaan, Tanpa Install) ---
const IconDashboard = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);
const IconFile = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const IconUsers = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const IconCalendar = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const IconSearch = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const IconBell = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export default function App() {
  // Pengganti React Router: Menggunakan state untuk berpindah menu
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menus = [
    { name: "Dashboard", icon: <IconDashboard /> },
    { name: "Program Kerja", icon: <IconFile /> },
    { name: "Divisi & Tim", icon: <IconUsers /> },
    { name: "Jadwal Kegiatan", icon: <IconCalendar /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] font-sans overflow-hidden text-gray-800">
      {/* --- SIDEBAR KIRI --- */}
      <aside className="w-[280px] bg-[#162D34] text-white flex flex-col p-6 rounded-r-[40px] z-10 shadow-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#2DAB67] rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-green-900/50">
            B
          </div>
          <h1 className="font-bold text-lg leading-tight tracking-widest">
            BEM UISI
          </h1>
        </div>

        {/* Profil */}
        <div className="bg-[#1F3A43] p-4 rounded-3xl mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#162D34] flex items-center justify-center font-bold text-xl border-2 border-[#2DAB67]">
            A
          </div>
          <div>
            <p className="text-xs text-gray-400">Selamat Pagi,</p>
            <p className="font-bold text-sm"></p>Ricky
            <p className="text-[10px] text-[#2DAB67] mt-0.5">
              Admin BEM - Aktif
            </p>
          </div>
        </div>

        {/* Navigasi Menu */}
        <nav className="flex-1 space-y-2">
          {menus.map((menu) => (
            <button
              key={menu.name}
              onClick={() => setActiveMenu(menu.name)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                activeMenu === menu.name
                  ? "bg-[#2DAB67] text-white shadow-lg shadow-[#2DAB67]/30"
                  : "text-gray-400 hover:bg-[#1F3A43] hover:text-white"
              }`}
            >
              {menu.icon}
              <span className="text-sm font-medium">{menu.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- AREA KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8 lg:p-10">
        {/* Header / Navbar */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Sistem Informasi Manajemen
            </h2>
            <p className="text-gray-500 mt-1">
              Mengelola kegiatan organisasi menjadi lebih mudah.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 lg:w-80">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </div>
              <input
                type="text"
                placeholder="Cari program kerja..."
                className="w-full bg-white border-none shadow-sm rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#2DAB67] transition-all"
              />
            </div>
            <button className="bg-white p-3.5 rounded-2xl shadow-sm text-gray-500 hover:bg-gray-50 hover:text-[#2DAB67] transition-all">
              <IconBell />
            </button>
          </div>
        </header>

        {/* Konten Berubah Sesuai Menu */}
        {activeMenu === "Dashboard" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Kolom Kiri (Lebar) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Kartu Ringkasan */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-[#EBF5FF] p-6 rounded-[32px]">
                  <p className="text-sm font-semibold text-blue-600 mb-1">
                    Total Proker
                  </p>
                  <p className="text-3xl font-black text-gray-800">24</p>
                </div>
                <div className="bg-[#ECFDF5] p-6 rounded-[32px]">
                  <p className="text-sm font-semibold text-[#2DAB67] mb-1">
                    Telah Selesai
                  </p>
                  <p className="text-3xl font-black text-gray-800">18</p>
                </div>
                <div className="bg-[#FFFBEB] p-6 rounded-[32px]">
                  <p className="text-sm font-semibold text-yellow-600 mb-1">
                    Menunggu Validasi
                  </p>
                  <p className="text-3xl font-black text-gray-800">6</p>
                </div>
              </div>

              {/* Area Grafik (Placeholder) */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                  Grafik Aktivitas BEM (2026)
                </h3>
                <div className="h-64 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  <p>Visualisasi Data Grafik Disini</p>
                </div>
              </div>
            </div>

            {/* Kolom Kanan (Sempit) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[40px] shadow-sm h-full">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                  Agenda Terdekat
                </h3>

                <div className="space-y-6">
                  {/* Item Agenda 1 */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-blue-600 flex-shrink-0">
                      <span className="text-xs font-bold">12</span>
                      <span className="text-[10px]">Okt</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Rapat Pleno BEM</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ruang Rapat Utama
                      </p>
                    </div>
                  </div>

                  {/* Item Agenda 2 */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex flex-col items-center justify-center text-[#2DAB67] flex-shrink-0">
                      <span className="text-xs font-bold">20</span>
                      <span className="text-[10px]">Okt</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Expo Universitas
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Gedung Serbaguna
                      </p>
                    </div>
                  </div>

                  {/* Item Agenda 3 */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex flex-col items-center justify-center text-orange-600 flex-shrink-0">
                      <span className="text-xs font-bold">05</span>
                      <span className="text-[10px]">Nov</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Evaluasi Proker</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Daring (Zoom)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tampilan jika menu lain diklik */
          <div className="bg-white p-10 rounded-[40px] shadow-sm flex items-center justify-center h-96 border-2 border-dashed border-gray-200">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Halaman sedang dikembangkan</p>
              <h2 className="text-2xl font-bold text-gray-700">
                {activeMenu} BEM UISI
              </h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
