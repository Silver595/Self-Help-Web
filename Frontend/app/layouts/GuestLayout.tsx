import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { getCurrentUser } from '~/lib/auth';

export default function GuestLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [checkedPath, setCheckedPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // Hide the auth form until this route's session check finishes.
    setCheckedPath(null);

    getCurrentUser()
      .then(() => {
        if (active) {
          navigate('/dashboard', { replace: true });
        }
      })
      .catch(() => {
        // No valid session: allow login/signup to render.
        if (active) {
          setCheckedPath(pathname);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname, navigate]);

  if (checkedPath !== pathname) {
    return (
      <main
        className="min-h-screen grid place-items-center bg-white text-sm text-[#5C5E62]"
        role="status"
      >
        Checking your session...
      </main>
    );
  }

  return <Outlet />;
}
