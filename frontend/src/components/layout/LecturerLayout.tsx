import { Outlet } from 'react-router-dom';
import LecturerNav from './LecturerNav';
import { ModuleProvider } from '../../context/ModuleContext';

export default function LecturerLayout() {
  return (
    <ModuleProvider>
      <div className="min-h-screen bg-amber-50/30 flex flex-col">
        <LecturerNav />
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </ModuleProvider>
  );
}

