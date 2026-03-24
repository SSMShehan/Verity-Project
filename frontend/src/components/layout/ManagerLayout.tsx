import { Outlet } from 'react-router-dom';
import ManagerNav from './ManagerNav';

export default function ManagerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <ManagerNav />
      {/* 
        Manager specific dark crimson theme accent 
        Distinguishes globally from Lecturer (Amber) and Student (Blue)
      */}
      <main className="flex-1 w-full relative z-0 mt-8 mb-12">
        <Outlet />
      </main>
    </div>
  );
}
