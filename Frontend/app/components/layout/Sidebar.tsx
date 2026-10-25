import { useState } from 'react';
import {
  Clock,
  CheckSquare,
  Book,
  FileText,
  GitCommitHorizontal,
  BarChart2,
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crosshair,
} from 'lucide-react';

interface User {
  name: string;
  workspace: string;
  initial: string;
}

interface SidebarProps {
  active?: string;
  onNavigate?: (id: string) => void;
  onQuickCapture?: () => void;
  onSearch?: () => void;
  user?: User;
}

const NAV = [
  { id: 'today', label: 'TODAY', icon: Clock },
  { id: 'habits', label: 'HABITS', icon: CheckSquare },
  { id: 'library', label: 'LIBRARY', icon: Book },
  { id: 'journal', label: 'JOURNAL', icon: FileText },
  { id: 'timeline', label: 'TIMELINE', icon: GitCommitHorizontal },
  { id: 'insights', label: 'INSIGHTS', icon: BarChart2 },
];

const PINNED = ['ATOMIC HABITS', 'WEEKLY REFLECTION'];

export default function Sidebar({
  active = 'today',
  onNavigate = () => {},
  onQuickCapture = () => {},
  onSearch = () => {},
  user = { name: 'ALEX MORGAN', workspace: 'ALEX', initial: 'A' },
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      onClick={() => {
        // Expands only when clicking on empty background space
        if (collapsed) setCollapsed(false);
      }}
      className={`relative flex h-screen flex-col border-r border-neutral-300/70 bg-[#ececec] font-mono text-[12px] text-neutral-600 transition-[width] duration-200 ${
        collapsed ? 'w-[72px] cursor-pointer' : 'w-[280px]'
      }`}
    >
      {/* Top Header / Brand */}
      <div
        className={`flex h-[68px] items-center border-b border-neutral-300/80 ${
          collapsed ? 'justify-center px-2' : 'mx-4 justify-between'
        }`}
      >
        <div className='flex items-center gap-2.5'>
          <div className='relative flex h-8 w-8 items-center justify-center rounded border border-neutral-400 bg-transparent'>
            <span className='absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#ff3d00]' />
            {collapsed ? (
              <Crosshair size={16} className='text-neutral-700' />
            ) : (
              <div className='h-3 w-3 border-b border-r border-neutral-600' />
            )}
          </div>
          {!collapsed && (
            <span className='font-sans text-[15px] font-bold tracking-tight text-neutral-800'>
              GROWTH <span className='text-[#ff3d00]'>OS</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            aria-label='Collapse sidebar'
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(true);
            }}
            className='text-neutral-400 hover:text-neutral-700 cursor-pointer'
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col overflow-y-auto pb-2 ${
          collapsed ? 'items-center px-2 pt-3' : 'px-4 pt-4'
        }`}
      >
        {/* Workspace Switcher / Avatar Top (when collapsed) */}
        {collapsed ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className='mb-3 flex flex-col items-center gap-3 w-full cursor-default'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#404040] font-sans text-xs font-semibold text-white shadow-sm'>
              {user.initial}
            </span>
            <div className='w-full border-t border-neutral-300/80 my-1' />
          </div>
        ) : (
          <button
            onClick={(e) => e.stopPropagation()}
            className='relative mb-3 flex w-full items-center justify-between rounded-xl border border-neutral-300/70 bg-[#ececec] px-3.5 py-2.5 shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] transition-all hover:border-neutral-400 cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-[#404040] font-sans text-xs font-semibold text-white'>
                {user.initial}
              </span>
              <div className='text-left leading-snug'>
                <span className='block font-sans text-[13px] font-bold tracking-tight text-neutral-800'>
                  {user.workspace}
                </span>
                <span className='block font-sans text-[11px] normal-case text-neutral-400'>
                  Personal workspace
                </span>
              </div>
            </div>
            <ChevronDown size={14} className='text-neutral-500' />
          </button>
        )}

        {/* Nav Items */}
        <nav
          className={`flex flex-col gap-2 pt-1 ${collapsed ? 'w-full items-center' : 'w-full'}`}
        >
          {NAV.map(({ id, label, icon: Icon }, i) => {
            const isActive = id === active;
            return (
              <div
                key={id}
                className={`relative flex items-center ${collapsed ? 'w-full justify-center' : ''}`}
              >
                {isActive && (
                  <span
                    className={`absolute ${
                      collapsed ? '-left-2' : '-left-4'
                    } top-1/2 h-7 w-[3.5px] -translate-y-1/2 rounded-r bg-[#ff3d00]`}
                  />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents sidebar from expanding when clicking a nav item
                    onNavigate(id);
                  }}
                  className={`flex items-center rounded-xl border border-neutral-300/70 bg-[#ececec] transition-all shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] cursor-pointer ${
                    collapsed
                      ? 'w-13 h-11 justify-center gap-1 px-1 py-1 text-[9px]'
                      : 'w-full px-3.5 py-2.5 text-[11px] tracking-wider'
                  } ${
                    isActive
                      ? 'font-bold text-[#ff3d00]'
                      : 'text-neutral-600 hover:text-neutral-900 hover:border-neutral-400'
                  }`}
                >
                  <Icon
                    size={collapsed ? 15 : 16}
                    strokeWidth={1.75}
                    className={isActive ? 'text-[#ff3d00]' : 'text-neutral-600'}
                  />
                  {collapsed ? (
                    <span
                      className={`text-[9px] font-bold ${isActive ? 'text-[#ff3d00]' : 'text-neutral-400'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ) : (
                    <>
                      <span className='ml-3 flex-1 text-left'>{label}</span>
                      <span
                        className={`text-[10px] ${
                          isActive ? 'text-[#ff3d00]' : 'text-neutral-400'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          className={`my-4 border-t border-neutral-300/80 ${collapsed ? 'w-10' : 'w-full'}`}
        />

        {/* Search & Quick Capture */}
        {collapsed ? (
          <div className='flex flex-col gap-2.5 items-center w-full'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSearch();
              }}
              className='flex h-11 w-13 items-center justify-center rounded-xl border border-neutral-300/70 bg-[#ececec] text-neutral-600 shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] hover:text-neutral-900 hover:border-neutral-400 transition-all cursor-pointer'
            >
              <Search size={16} strokeWidth={1.75} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickCapture();
              }}
              className='flex h-11 w-13 items-center justify-center rounded-xl bg-[#ff3d00] text-white shadow-[0_10px_20px_-4px_rgba(255,61,0,0.35)] transition-colors hover:bg-[#e03600] cursor-pointer'
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-2.5'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSearch();
              }}
              className='flex w-full items-center justify-between rounded-xl border border-neutral-300/70 bg-[#ececec] px-3.5 py-2 text-[11px] tracking-wider text-neutral-600 shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] hover:text-neutral-900 hover:border-neutral-400 transition-all cursor-pointer'
            >
              <div className='flex items-center gap-3'>
                <Search size={16} strokeWidth={1.75} />
                <span>SEARCH</span>
              </div>
              <kbd className='rounded border border-neutral-400/60 bg-white/70 px-1.5 py-0.5 text-[9px] text-neutral-500'>
                ⌘K
              </kbd>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickCapture();
              }}
              className='flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#ff3d00] text-[11px] font-bold tracking-wider text-white shadow-[0_10px_20px_-4px_rgba(255,61,0,0.35)] transition-colors hover:bg-[#e03600] cursor-pointer'
            >
              <Plus size={16} strokeWidth={2.5} /> QUICK CAPTURE
            </button>

            {/* Pinned Section */}
            <div className='mt-4'>
              <p className='px-1 text-[10px] font-bold tracking-widest text-neutral-400'>
                PINNED
              </p>
              <ul className='mt-2.5 flex flex-col gap-2.5'>
                {PINNED.map((p) => (
                  <li key={p}>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className='flex items-center gap-2 px-1 text-[11px] tracking-wider text-neutral-600 hover:text-neutral-900 cursor-pointer'
                    >
                      <svg
                        width='14'
                        height='8'
                        viewBox='0 0 14 8'
                        fill='none'
                        className='text-neutral-400'
                      >
                        <path
                          d='M0 4H10M10 4A2 2 0 1014 4A2 2 0 0010 4Z'
                          stroke='currentColor'
                          strokeWidth='1.2'
                        />
                      </svg>
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* User Footer / Expand Toggle */}
      <div
        className={`border-t border-neutral-300/80 py-3 ${
          collapsed ? 'flex flex-col items-center gap-3 px-2' : 'mx-4'
        }`}
      >
        {collapsed ? (
          <>
            <button
              aria-label='Expand sidebar'
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(false);
              }}
              className='text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer'
            >
              <ChevronRight size={18} />
            </button>
            <span
              onClick={(e) => e.stopPropagation()}
              className='flex h-9 w-9 items-center justify-center rounded-full bg-[#404040] font-sans text-xs font-semibold text-white shadow-sm cursor-default'
            >
              {user.initial}
            </span>
          </>
        ) : (
          <button
            onClick={(e) => e.stopPropagation()}
            className='flex w-full items-center gap-3 text-left cursor-pointer'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#404040] font-sans text-xs font-semibold text-white'>
              {user.initial}
            </span>
            <div className='leading-snug'>
              <span className='block text-[11px] font-bold tracking-wider text-neutral-800'>
                {user.name}
              </span>
              <span className='block font-sans text-[11px] normal-case text-neutral-400'>
                Settings &amp; system
              </span>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}
