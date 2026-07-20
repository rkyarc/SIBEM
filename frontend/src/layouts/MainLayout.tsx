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
        <div className="p-4 md:p-8 pb-0 print:hidden">
          <Navbar 
            activeMenu={activeMenu}
            onMenuClick={() => setIsMobileMenuOpen(true)} 
            setActiveMenu={setActiveMenu} 
          />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:px-8 pb-8 print:overflow-visible print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}