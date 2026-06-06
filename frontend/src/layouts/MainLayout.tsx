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
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      {/* 3. TERUSKAN PAKETNYA: Kirim activeMenu ke Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Area Kanan */}
      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <div className="p-4 md:p-8 pb-0">
          <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}