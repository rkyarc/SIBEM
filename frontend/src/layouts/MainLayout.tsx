import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function MainLayout({ children, activeMenu, setActiveMenu }: MainLayoutProps) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-800">
      {/* 3. TERUSKAN PAKETNYA: Kirim activeMenu ke Sidebar */}
      <div className="print:hidden">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Area Kanan */}
      <div className="flex flex-1 flex-col overflow-hidden w-full relative print:overflow-visible print:h-auto">
      {/* SAFE, SUBTLE MODERN BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Motif Grid Modern */}
        <div className="absolute inset-0 opacity-[0.7] dark:opacity-[0.1]" 
             style={{ 
               backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', 
               backgroundSize: '40px 40px',
               maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
               WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
             }} 
        />
        {/* Soft Colored Ambient Orbs */}
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-orange-500/15 rounded-full blur-[120px]" />
      </div>

        <div className="p-4 md:p-8 pb-0 print:hidden relative">
          <Navbar
            activeMenu={activeMenu}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            setActiveMenu={setActiveMenu}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:px-8 pb-8 print:overflow-visible print:p-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
