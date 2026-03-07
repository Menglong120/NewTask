import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden font-sans antialiased text-white selection:bg-[#696cff]/30 selection:text-[#696cff]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 transition-all duration-300">
        <div className="h-20 w-full flex-none relative z-50">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative pt-[80px]">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#696cff]/5 to-transparent pointer-events-none -z-10"></div>
          {children}
        </main>
      </div>
      
      {/* Global Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 9999px; border: 2px solid #0a0a0a; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #444; }
      `}} />
    </div>
  );
}
