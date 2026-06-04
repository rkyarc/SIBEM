import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar tetap di kiri */}
      <Sidebar />
      
      {/* Area konten utama */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar />
        
        {/* Tempat halaman (Dashboard/Proker) akan dirender (Outlet) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;