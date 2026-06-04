const Navbar = () => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10 border-b border-gray-200">
      <div className="text-gray-600 font-medium">
        Sistem Informasi Manajemen Kegiatan BEM
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-700">Admin BEM</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        {/* Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;