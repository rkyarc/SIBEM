import { useState, useEffect } from "react";

export default function Profile() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // State untuk mock toggle switches

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((i: string) => i[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("presiden") || r.includes("wakil")) return "bg-purple-100 text-purple-700";
    if (r.includes("menteri")) return "bg-orange-100 text-orange-700";
    if (r.includes("sekretaris") || r.includes("bendahara")) return "bg-blue-100 text-blue-700";
    if (r.includes("staff") || r.includes("staf")) return "bg-green-100 text-green-700";
    if (r === "admin") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-28 md:h-36 bg-orange-500 w-full relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        {/* Konten Bawah Banner */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-row gap-4 md:gap-5">
            {/* Foto Bulat */}
            <div className="-mt-10 md:-mt-16 h-20 w-20 md:h-32 md:w-32 bg-orange-400 rounded-full flex flex-shrink-0 items-center justify-center text-white text-3xl md:text-5xl font-bold shadow-lg border-4 border-white z-20 relative">
              {getInitials(user?.name)}
            </div>
            
            {/* Teks Info */}
            <div className="flex-1 text-left relative z-20">
              {/* Nama ditarik ke atas ke area orange */}
              <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md -mt-7 md:-mt-12">
                {user?.name || "Nama Pengguna"}
              </h1>
              
              {/* Badges di area putih */}
              <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-start gap-2 md:gap-3">
                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border shadow-sm ${getRoleBadgeColor(user?.role || "")}`}>
                  {user?.role || "Role"}
                </span>
                <span className="text-xs md:text-sm text-gray-600 font-medium px-3 md:px-4 py-1 md:py-1.5 bg-white rounded-full border border-gray-200 shadow-sm flex items-center gap-1.5 md:gap-2">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {user?.email || "Tidak ada email"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Bawah: Pengaturan Akun */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kolom Kiri: Info Umum & Sistem */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Informasi Kepengurusan</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wide mb-1">Nama Lengkap</p>
                <p className="text-sm font-medium text-gray-800">{user?.name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wide mb-1">Jabatan di BEM</p>
                <p className="text-sm font-medium text-gray-800">{user?.role || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wide mb-1">Email Terdaftar</p>
                <p className="text-sm font-medium text-gray-800 break-all">{user?.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wide mb-1">Status Akun</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-bold text-green-600">Aktif</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Sistem */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Informasi Sistem</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Versi SIBEM</span>
                <span className="text-sm font-bold text-gray-900">v1.2.4 (Beta)</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Framework</span>
                <span className="text-sm font-bold text-gray-900">React + Laravel</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed text-center">
                Jika Anda mengalami kendala teknis atau menemukan *bug*, silakan hubungi tim Administrator BEM.
              </p>
              <button className="w-full mt-4 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-2.5 rounded-xl text-sm transition-colors">
                Hubungi Dukungan
              </button>
            </div>
          </div>
        </div>
        
        {/* Kolom Kanan: Pengaturan Sistem */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Pengaturan Keamanan & Akun */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Keamanan & Akun</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 text-orange-800 text-sm p-4 rounded-xl mb-6 font-medium">
              Saat ini perubahan nama dan password hanya dapat dilakukan melalui Administrator BEM. Fitur edit mandiri sedang dalam pengembangan.
            </div>

            <form className="space-y-5 opacity-60">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    disabled 
                    value={user?.name || ""} 
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Terdaftar</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ""} 
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm cursor-not-allowed" 
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 mt-6 mb-3">Ubah Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Password Lama</label>
                    <input 
                      type="password" 
                      disabled 
                      placeholder="••••••••" 
                      className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Password Baru</label>
                    <input 
                      type="password" 
                      disabled 
                      placeholder="••••••••" 
                      className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="button" 
                  disabled 
                  className="px-6 py-2.5 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* 2. Preferensi Notifikasi */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Preferensi Notifikasi</h2>
            </div>
            
            <div className="space-y-5">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-800">Notifikasi Dalam Aplikasi</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-full">Dalam Pengembangan</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Tampilkan lencana merah di lonceng saat ada revisi baru.</p>
                </div>
                <button 
                  disabled
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200 opacity-50`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0`} />
                </button>
              </div>
              <hr className="border-gray-50" />
              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-800">Notifikasi Email</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-full">Dalam Pengembangan</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Kirim email ringkasan kegiatan dan status pengajuan KAK.</p>
                </div>
                <button 
                  disabled
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200 opacity-50`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0`} />
                </button>
              </div>
              <hr className="border-gray-50" />
              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-800">Push Notifications</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-full">Dalam Pengembangan</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Munculkan notifikasi pop-up dari browser Anda.</p>
                </div>
                <button 
                  disabled
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200 opacity-50`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0`} />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Tampilan & Personalisasi */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Tampilan</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Mode Gelap (Dark Mode)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Ubah tampilan aplikasi menjadi tema warna gelap.</p>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-orange-500' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
