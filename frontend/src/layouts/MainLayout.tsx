import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface MainLayoutProps {
  children: ReactNode;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function MainLayout({ children, activeMenu, setActiveMenu }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-[#FAFBFC] font-sans overflow-hidden">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="flex-1 flex flex-col h-full overflow-y-auto px-10 py-8">
        <Navbar />
        {children}
      </main>
    </div>
  );
}