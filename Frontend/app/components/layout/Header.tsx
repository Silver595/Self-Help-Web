import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { logoutRequest } from '~/lib/auth';
import { ApiRequestError } from '~/lib/api';
import { Bell, Moon, Plus, Search, Sun } from 'lucide-react';

const Header = (
  {
  section = "Library",
  scope = "LOC",
  hasUnread = true,
  user = { initial: "A" },
  onSearch = () => {},
  onCreate = () => {},
  onNotifications = () => {},
  onToggleTheme = () => {},
  dark = false,
}
) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearch]);

  const handleLogout = async () => {
    try {
      await logoutRequest();

      // The backend successfully destroyed the session.
      navigate('/login', { replace: true });
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        error.status === 401
      ) {
        // The session is already invalid.
        navigate('/login', { replace: true });
        return;
      }

      console.error('Logout failed:', error);

      window.alert(
        'Logout could not be completed. Please try again.',
      );
    }
  };

  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff3d00]";

  return (
    <header className="flex h-[75px] items-center justify-between border-b border-neutral-300 bg-[#ececec] px-8 font-mono">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] tracking-wide">
        <span className="text-[#ff3d00]">{scope}</span>
        <span className="text-[#ff3d00]">/</span>
        <span className="text-neutral-600">{section}</span>
      </nav>

      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={onSearch}
          className="flex h-10 w-[262px] items-center gap-3 rounded-lg border border-neutral-300 bg-white px-3 text-[12px] uppercase tracking-wide text-neutral-500 hover:border-neutral-500"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Search anything</span>
          <kbd className="rounded border border-neutral-400 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>

        {/* Create */}
        <button aria-label="Create new" onClick={onCreate} className={iconBtn}>
          <Plus size={18} />
        </button>

        {/* Notifications */}
        <button aria-label="Notifications" onClick={onNotifications} className={iconBtn}>
          <Bell size={18} />
          {hasUnread && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff3d00]" />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="flex h-10 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-[12px] uppercase tracking-wide text-neutral-700 hover:border-neutral-500"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? "Light" : "Dark"}
        </button>

        {/* Avatar */}
        <button
          aria-label="Account"
          className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 font-sans text-sm font-semibold text-white"
        >
          {user.initial}
        </button>
      </div>
    </header>
  );
}
export default Header;