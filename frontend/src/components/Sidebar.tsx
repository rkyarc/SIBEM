import { useState } from "react";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  // 1. State isOpen tetap sama
  const [isOpen, setIsOpen] = useState(true);

  const menus = [
    { name: "Overview", icon: "📈" },
    { name: "Kegiatan", icon: "📋" },
    { name: "Pengajuan KAK", icon: "📝" },
    { name: "Anggaran", icon: "💳" },
    { name: "Kementerian", icon: "🏛️" },
    { name: "Laporan", icon: "📊" },
    { name: "Pengaturan", icon: "⚙️" },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-24" // 2. Saat tertutup sedikit diperlebar agar logo Hamburger pas di tengah
      } bg-white border-r border-gray-100 flex flex-col h-full z-10 transition-all duration-300 relative`}
    >
      {/* --- AREA HEADER: GABUNGAN LOGO & TOMBOL GARIS 3 --- */}
      <div
        className={`h-24 flex items-center ${
          isOpen ? "px-6 justify-start gap-3" : "justify-center"
        } border-b border-gray-50 transition-all`}
      >
        {/* 3. Tombol Hamburger (SVG) sebagai Saklar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg text-orange-500 hover:bg-orange-50 focus:outline-none transition-colors"
          title={isOpen ? "Tutup Menu" : "Buka Menu"}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animasi tipis: Garis hamburger sedikit berubah bentuk */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d={isOpen ? "M4 6h16M4 12h10M4 18h16" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        {/* 4. Teks SIBEM dengan efek Fade yang lebih halus */}
        <h1
          className={`text-2xl font-extrabold text-orange-500 transition-all duration-300 overflow-hidden whitespace-nowrap ${
            isOpen ? "opacity-100 w-auto ml-1" : "opacity-0 w-0"
          }`}
        >
          SIBEM
        </h1>
      </div>

      {/* Area Menu Navigasi (Hanya menyesuaikan padding) */}
      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto overflow-x-hidden">
        {menus.map((menu) => (
          <button
            key={menu.name}
            onClick={() => setActiveMenu(menu.name)}
            title={!isOpen ? menu.name : ""}
            className={`w-full flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center px-0"
            } py-3.5 rounded-xl font-medium transition-all duration-200 ${
              activeMenu === menu.name
                ? "bg-orange-50 text-orange-600 shadow-inner"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span className="text-xl flex-shrink-0">{menu.icon}</span>
            {/* Nama menu hanya muncul jika isOpen = true */}
            <span
              className={`text-sm ml-4 transition-all duration-300 whitespace-nowrap ${
                isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              {menu.name}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}