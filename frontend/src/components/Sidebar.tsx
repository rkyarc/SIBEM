import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/proker', label: 'Program Kerja (Proker)' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-lg z-20">
      <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-950">
        <h2 className="text-xl font-bold text-blue-400">SIBEM UISI</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs text-slate-400 font-semibold mb-4 uppercase tracking-wider">Menu Utama</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;