import { Outlet } from 'react-router';
import Header from '~/components/layout/Header';
import ScrollProgress from '~/components/layout/ScrollProgress';
import Sidebar from '~/components/layout/Sidebar';

export default function AppLayout() {
  return (
    <div className='flex h-screen overflow-hidden bg-[#ececec] text-[#171A20]'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Layout */}
      <div className='flex min-w-0 flex-1 flex-col overflow-hidden bg-white text-[#171A20]'>
        {/* Header */}
        <Header />
        <ScrollProgress />

        {/* Scrollable Area: scrollbar at far right */}
        <main className='min-h-0 flex-1 overflow-y-auto'>
          <div className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
