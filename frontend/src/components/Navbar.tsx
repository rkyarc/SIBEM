import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Menerima perintah onMenuClick dari MainLayout
interface NavbarProps {
  activeMenu?: string;
  onMenuClick?: () => void;
  setActiveMenu?: (menu: string) => void;
}

interface UserData {
  id?: number;
  name: string;
  role: string;
  email?: string;
  [key: string]: unknown;
}

interface NotificationData {
  id: number;
  nama_kegiatan: string;
  tipe_pengajuan: string;
  catatan_revisi?: string;
  status: string;
  user_id?: number;
}

export default function Navbar({ activeMenu, onMenuClick, setActiveMenu }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const navbarRef = useRef<HTMLDivElement>(null);

  const [user] = useState<UserData | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    fetchNotifications();

    const handleRefresh = () => fetchNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);

    return () => {
      window.removeEventListener("refresh-notifications", handleRefresh);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/kak", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ambil data pengajuan milik user yang sedang login dan berstatus revisi
      const userRevisions = response.data.filter((item: NotificationData) => {
        return item.user_id === user.id && item.status?.toLowerCase().startsWith('revisi');
      });
      setNotifications(userRevisions);
    } catch (error) {
      console.error("Gagal mengambil data notifikasi:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Kembali ke login
  };

  const getHeaderInfo = () => {
    switch(activeMenu) {
      case "Kegiatan": return { title: "Manajemen Program Kerja", subtitle: "Kelola pengajuan dan pelaksanaan proker BEM UISI." };
      case "Pengajuan KAK LPJ": return { title: "Pengajuan KAK & LPJ", subtitle: "Pantau dan kelola dokumen administrasi kegiatan." };
      case "Anggaran": return { title: "Manajemen Anggaran", subtitle: "Pantau arus kas dan alokasi dana secara real-time." };
      case "Kementerian": return { title: "Manajemen Kementerian", subtitle: "Kelola data kementerian dan struktur BEM UISI." };
      case "Laporan": return { title: "Laporan & Arsip", subtitle: "Unduh dan lihat rekapitulasi data organisasi." };
      case "Presensi": return { title: "Presensi Kegiatan", subtitle: "Kelola data kehadiran kegiatan." };
      case "Profil Saya": return { title: "Profil Saya", subtitle: "Atur informasi akun dan preferensi Anda." };
      case "Overview": default: return { title: "Selamat Datang", subtitle: "Kelola dan pantau seluruh kegiatan organisasi secara menyeluruh" };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <header className="flex justify-between items-center mb-2">
      {/* Bagian Kiri: Tombol HP + Teks Sambutan */}
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger HP (Otomatis hilang di Laptop) */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">{headerInfo.title}</h2>
          <p className="hidden md:block text-gray-400 mt-1 text-sm">
            {headerInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Bagian Kanan: Ikon & Profil */}
      <div className="flex items-center gap-3 md:gap-5" ref={navbarRef}>
        <button className="hidden md:block text-gray-400 hover:text-orange-500 transition-colors p-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </button>
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsDropdownOpen(false); // Tutup dropdown profil jika terbuka
            }}
            className={`transition-colors relative p-1 ${notifications.length > 0 ? 'text-orange-500 hover:text-orange-600' : 'text-gray-400 hover:text-orange-500'}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Pop-up Notifikasi */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">Notifikasi Revisi</h3>
                {notifications.length > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">{notifications.length} Baru</span>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <button 
                      key={notif.id} 
                      onClick={() => {
                        if (setActiveMenu) {
                          localStorage.setItem('open_revisi_id', notif.id.toString());
                          localStorage.setItem('open_revisi_tab', notif.tipe_pengajuan || 'kak');
                          setActiveMenu("Pengajuan KAK LPJ");
                          setIsNotificationOpen(false);
                        }
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-gray-50 transition-colors flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{notif.nama_kegiatan}</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${notif.tipe_pengajuan?.toLowerCase() === 'lpj' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                          {notif.tipe_pengajuan || 'KAK'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2"><span className="font-semibold text-gray-700">Catatan:</span> {notif.catatan_revisi || "Silakan cek detail pengajuan untuk revisi."}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 flex flex-col items-center">
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <p className="text-sm font-medium">Tidak ada revisi baru</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profil BEM */}
        <div className="relative md:ml-4">
          <button 
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationOpen(false); // Tutup notifikasi jika terbuka
            }} 
            className="flex items-center gap-3 text-left focus:outline-none hover:opacity-80 transition-opacity"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <div className="h-9 w-9 md:h-10 md:w-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name?.split(" ").slice(0, 2).map((i: string) => i[0]).join("").toUpperCase()}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 mb-1 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "Tidak ada email"}</p>
              </div>
              <button 
                onClick={() => {
                  if (setActiveMenu) {
                    setActiveMenu("Profil Saya");
                    setIsDropdownOpen(false);
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                Profil Saya
              </button>
              <hr className="my-1 border-gray-100" />
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Keluar</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}