import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex h-screen bg-[#0a0a0a] overflow-hidden font-sans antialiased text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <div className="h-20 w-full flex-none relative z-50">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto w-full relative p-6">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
          {children}
        </main>
      </div>
    </div>
  );
}
