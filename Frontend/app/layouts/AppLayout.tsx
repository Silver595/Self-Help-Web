import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Header from '~/components/layout/Header';
import { getCurrentUser } from '~/lib/auth';

export default function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  // Auth cookies are httpOnly and only exist in the browser, so the check runs here.
  useEffect(() => {
    getCurrentUser()
      .then(() => setReady(true))
      .catch(() => navigate('/login', { replace: true }));
  }, [navigate]);

  if (!ready) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white text-[#171A20]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
