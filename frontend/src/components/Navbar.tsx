import { useState } from "react"; // 1. Wajib import useState

export default function Navbar() {
  // 2. Buat state untuk saklar dropdown (default: false/tertutup)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex justify-between items-start mb-8">
      {/* Bagian Kiri: Teks Sambutan (Tetap sama) */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
        <p className="text-gray-400 mt-1 text-sm">
          Kelola dan pantau seluruh kegiatan organisasi secara menyeluruh
        </p>
      </div>

      {/* Bagian Kanan: Ikon & Profil */}
      <div className="flex items-center gap-5">
        <button className="text-gray-300 hover:text-gray-500 text-xl">✉️</button>
        <button className="text-orange-400 hover:text-orange-500 text-xl relative">
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* --- AREA PROFIL YANG DIMODIFIKASI --- */}
        <div className="relative ml-4">
          
          {/* 3. Bungkus nama dan foto ke dalam elemen <button> agar bisa diklik */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // 4. Pemicu ubah status
            className="flex items-center gap-3 text-left focus:outline-none hover:opacity-80 transition-opacity"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Salsabila Alun</p>
              <p className="text-xs text-gray-400">Presiden BEM</p>
            </div>
            <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              SA
            </div>
          </button>

          {/* 5. Menu Dropdown yang muncul otomatis saat state = true */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profil Saya
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Pengaturan
              </button>
              <hr className="my-1 border-gray-100" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                Keluar
              </button>
            </div>
          )}
          
        </div>
        {/* --- AKHIR AREA PROFIL --- */}
      </div>
    </header>
  );
}