import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { getCurrentUser } from '~/lib/auth';
import { ApiRequestError } from '~/lib/api';
import ScrollProgress from '~/components/layout/ScrollProgress';
import Header from '~/components/layout/Header';
import Sidebar from '~/components/layout/Sidebar';

type AuthCheck = {
  pathname: string;
  status: 'authenticated' | 'unavailable';
} | null;

export default function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [authCheck, setAuthCheck] = useState<AuthCheck>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    // The previous verification belongs to another route.
    setAuthCheck(null);

    getCurrentUser()
      .then(() => {
        if (active) {
          setAuthCheck({
            pathname,
            status: 'authenticated',
          });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        if (error instanceof ApiRequestError && error.status === 401) {
          navigate('/login', { replace: true });
          return;
        }

        // Network/server errors are not proof that the session
        // has expired. Keep private content hidden and allow retry.
        setAuthCheck({
          pathname,
          status: 'unavailable',
        });
      });

    return () => {
      active = false;
    };
  }, [pathname, navigate, retryCount]);

  // Do not render a route while its authentication check is pending.
  if (!authCheck || authCheck.pathname !== pathname) {
    return (
      <main
        className='min-h-screen grid place-items-center bg-white text-sm text-[#5C5E62]'
        role='status'
      >
        Verifying your session...
      </main>
    );
  }

  // Fail closed if verification cannot be completed.
  if (authCheck.status === 'unavailable') {
    return (
      <main className='min-h-screen grid place-items-center bg-white p-6'>
        <div className='max-w-md space-y-4 text-center'>
          <h1 className='text-xl font-semibold text-[#171A20]'>
            Unable to verify your session
          </h1>

          <p className='text-sm text-[#5C5E62]'>
            Check your connection and try again. Your private content will
            remain hidden until your session is verified.
          </p>

          <button
            type='button'
            onClick={() => setRetryCount((count) => count + 1)}
            className='bg-[#171A20] px-5 py-2.5 text-sm font-medium text-white'
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

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
