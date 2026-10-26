import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { logoutRequest } from '~/lib/auth';
import { ApiRequestError } from '~/lib/api';
import { Bell, Moon, Plus, Search, Sun, LogOut } from 'lucide-react';

interface HeaderProps {
  section?: string;
  scope?: string;
  hasUnread?: boolean;
  user?: { initial?: string };
  onSearch?: () => void;
  onCreate?: () => void;
  onNotifications?: () => void;
  onToggleTheme?: () => void;
  dark?: boolean;
}

const Header = ({
  section = 'Library',
  scope = 'LOC',
  hasUnread = true,
  user = { initial: 'A' },
  onSearch = () => {},
  onCreate = () => {},
  onNotifications = () => {},
  onToggleTheme = () => {},
  dark = false,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSearch]);

  // Close the mobile menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logoutRequest();
      navigate('/login', { replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      console.error('Logout failed:', error);
      window.alert('Logout could not be completed. Please try again.');
    }
  };

  const iconBtn =
    'relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff3d00] cursor-pointer transition-colors sm:h-10 sm:w-10';

  const menuItem =
    'flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[12px] uppercase tracking-wide text-neutral-700 hover:bg-neutral-100';

  return (
    <header className='sticky top-0 z-30 flex h-[68px] w-full shrink-0 items-center justify-between gap-3 border-b border-neutral-300 bg-[#ececec] px-3 font-mono sm:h-[75px] sm:px-6 lg:px-8'>
      {/* Breadcrumb: takes the leftover space and truncates */}
      <nav
        aria-label='Breadcrumb'
        className='flex min-w-0 flex-1 items-center gap-1.5 text-[12px] tracking-wide sm:gap-2 sm:text-[13px]'
      >
        <span className='shrink-0 font-bold text-[#ff3d00]'>{scope}</span>
        <span className='shrink-0 text-[#ff3d00]'>/</span>
        <span className='truncate font-medium text-neutral-700'>{section}</span>
      </nav>

      {/* Actions */}
      <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
        {/* Search: full bar from lg, icon below */}
        <button
          onClick={onSearch}
          aria-label='Search'
          className='hidden h-10 w-48 items-center gap-2.5 rounded-lg border border-neutral-300 bg-white px-3 text-[12px] uppercase tracking-wide text-neutral-500 transition-colors hover:border-neutral-500 cursor-pointer lg:flex xl:w-[262px]'
        >
          <Search size={16} className='shrink-0' />
          <span className='flex-1 truncate text-left'>Search anything</span>
          <kbd className='hidden rounded border border-neutral-400 px-1.5 py-0.5 text-[9px] text-neutral-500 xl:inline-block'>
            ⌘K
          </kbd>
        </button>
        <button
          onClick={onSearch}
          aria-label='Search'
          className={`lg:hidden ${iconBtn}`}
        >
          <Search size={18} />
        </button>

        {/* Create: from md up (lives in the menu below md) */}
        <button
          aria-label='Create new'
          onClick={onCreate}
          className={`hidden md:grid ${iconBtn}`}
        >
          <Plus size={18} />
        </button>

        {/* Notifications: always visible */}
        <button
          aria-label='Notifications'
          onClick={onNotifications}
          className={iconBtn}
        >
          <Bell size={18} />
          {hasUnread && (
            <span className='absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff3d00]' />
          )}
        </button>

        {/* Theme: icon from md, label from xl */}
        <button
          onClick={onToggleTheme}
          aria-label='Toggle theme'
          className='hidden h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white text-[12px] uppercase tracking-wide text-neutral-700 transition-colors hover:border-neutral-500 md:flex xl:w-auto xl:px-3.5'
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          <span className='hidden xl:inline'>{dark ? 'Light' : 'Dark'}</span>
        </button>

        {/* Logout: icon from md, label from xl */}
        <button
          onClick={handleLogout}
          aria-label='Logout'
          className='hidden cursor-pointer items-center gap-1.5 px-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 md:flex'
        >
          <LogOut size={16} />
          <span className='hidden xl:inline'>Logout</span>
        </button>

        {/* Avatar; below md it opens a menu holding Create / Theme / Logout */}
        <div ref={menuRef} className='relative'>
          <button
            aria-label='Account'
            aria-haspopup='menu'
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-neutral-900 font-sans text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm'
          >
            {user.initial}
          </button>

          {menuOpen && (
            <div
              role='menu'
              className='absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-xl md:hidden'
            >
              <button
                role='menuitem'
                className={menuItem}
                onClick={() => {
                  setMenuOpen(false);
                  onCreate();
                }}
              >
                <Plus size={16} /> Create new
              </button>
              <button
                role='menuitem'
                className={menuItem}
                onClick={() => {
                  setMenuOpen(false);
                  onToggleTheme();
                }}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                {dark ? 'Light mode' : 'Dark mode'}
              </button>
              <button
                role='menuitem'
                className={`${menuItem} border-t border-neutral-200`}
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
