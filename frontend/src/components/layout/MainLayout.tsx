import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      {/* Fixed background decorative blobs to create a modern tech aesthetic */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[50%] w-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <Navbar />

      {/* Main content area with top padding for fixed navbar */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Outlet />
      </main>
    </div>
  );
}