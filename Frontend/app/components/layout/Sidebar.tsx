import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { NavLink } from 'react-router';
import { gsap } from 'gsap';
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
  onNavigate?: (id: string) => void;
  onQuickCapture?: () => void;
  onSearch?: () => void;
  user?: User;
}

// Change the `to` paths to match your routes
const NAV = [
  { id: 'today', label: 'TODAY', icon: Clock, to: '/today' },
  { id: 'habits', label: 'HABITS', icon: CheckSquare, to: '/habits' },
  { id: 'library', label: 'LIBRARY', icon: Book, to: '/library' },
  { id: 'journal', label: 'JOURNAL', icon: FileText, to: '/journal' },
  {
    id: 'timeline',
    label: 'TIMELINE',
    icon: GitCommitHorizontal,
    to: '/timeline',
  },
  { id: 'insights', label: 'INSIGHTS', icon: BarChart2, to: '/insights' },
];

const PINNED = ['ATOMIC HABITS', 'WEEKLY REFLECTION'];

// ---- Animation settings -------------------------------------------------
const WIDTH_OPEN = 280;
const WIDTH_RAIL = 72;
const FADE_OUT = 0.12; // content fades out before the layout swaps
const SLIDE = 0.45; // the width slide itself
const SLIDE_EASE = 'power3.inOut';

// Dock magnification
const DOCK_MAX_RAIL = 1.3; // peak scale when collapsed
const DOCK_MAX_OPEN = 1.1; // peak scale when expanded (items are full width, so keep it small)
const DOCK_SIGMA = 25; // px, how far the effect reaches from the cursor

// ---- Helpers ------------------------------------------------------------
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Collapsed preference lives outside React, so it survives remounts and reloads
const COLLAPSE_KEY = 'sidebar-collapsed';
const listeners = new Set<() => void>();
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
};
const writeCollapsed = (v: boolean) => {
  try {
    localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0');
  } catch {}
  listeners.forEach((l) => l());
};
function useStoredCollapsed(): [boolean, (v: boolean) => void] {
  const value = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readCollapsed,
    () => false,
  );
  return [value, writeCollapsed];
}

export default function Sidebar({
  onNavigate = () => {},
  onQuickCapture = () => {},
  onSearch = () => {},
  user = { name: 'ALEX MORGAN', workspace: 'ALEX', initial: 'A' },
}: SidebarProps) {
  const [manualCollapsed, setManualCollapsed] = useStoredCollapsed();
  const isSmall = useMediaQuery('(max-width: 1023px)');

  // What the user WANTS: always the rail below lg, otherwise their saved choice
  const targetCollapsed = isSmall || manualCollapsed;

  // What is currently DRAWN. It lags behind the target during the animation,
  // because the layout must swap while the content is faded out.
  const [collapsed, setCollapsed] = useState(targetCollapsed);

  const asideRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const readyRef = useRef(false);

  // After first paint, animations are allowed (before that, changes apply instantly)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      readyRef.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Kill any running timeline on unmount
  useEffect(() => () => void tlRef.current?.kill(), []);

  // Run the slide whenever the target changes
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const children = Array.from(el.children) as HTMLElement[];

    // First load / hydration / reduced motion: apply instantly, no animation
    if (!readyRef.current || reduce) {
      tlRef.current?.kill();
      tlRef.current = null;
      gsap.set(el, { clearProps: 'width' });
      gsap.set(children, { clearProps: 'opacity' });
      setCollapsed(targetCollapsed);
      return;
    }

    // Nothing to do (e.g. StrictMode double effect)
    if (targetCollapsed === collapsed && !tlRef.current) return;

    const navs = el.querySelectorAll('[data-nav]');
    const from = el.offsetWidth; // current real width, also correct if interrupted mid-animation
    const to = targetCollapsed ? WIDTH_RAIL : WIDTH_OPEN;

    tlRef.current?.kill();
    gsap.set(el, { width: from }); // GSAP owns the width while animating

    const tl = gsap.timeline({
      onComplete: () => {
        // Hand control back to the Tailwind classes
        gsap.set(el, { clearProps: 'width' });
        gsap.set(children, { clearProps: 'opacity' });
        gsap.set(navs, { x: 0 });
        tlRef.current = null;
      },
    });
    tlRef.current = tl;

    // 1) fade content out, 2) swap the layout while nobody can see it
    if (collapsed !== targetCollapsed) {
      tl.to(children, {
        opacity: 0,
        duration: FADE_OUT,
        ease: 'power1.out',
      }).add(() => {
        flushSync(() => setCollapsed(targetCollapsed));
      });
    }

    // 3) slide the width, 4) fade content back in with the nav items sliding in
    tl.to(el, { width: to, duration: SLIDE, ease: SLIDE_EASE })
      .to(children, { opacity: 1, duration: 0.25, ease: 'power1.out' }, '>-0.2')
      .fromTo(
        navs,
        { x: -10 },
        { x: 0, duration: 0.3, ease: 'power2.out', stagger: 0.04 },
        '<',
      );
  }, [targetCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Mac Dock effect ---------------------------------------------------
  const setDockScale = (el: HTMLElement, v: number) => {
    gsap.to(el, {
      scale: v,
      transformOrigin: '50% 50%',
      duration: 0.25,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    el.style.zIndex = v > 1.02 ? String(Math.round(v * 10)) : ''; // magnified item sits above neighbours
  };

  const handleDockMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return; // no hover on touch
    if (tlRef.current?.isActive()) return; // don't fight the collapse/expand animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const max = collapsed ? DOCK_MAX_RAIL : DOCK_MAX_OPEN;
    e.currentTarget
      .querySelectorAll<HTMLElement>('[data-dock]')
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = e.clientY - (r.top + r.height / 2); // vertical distance to the item's centre
        const falloff = Math.exp(-(d * d) / (2 * DOCK_SIGMA * DOCK_SIGMA)); // 1 at the cursor, fades out
        setDockScale(el, 1 + (max - 1) * falloff);
      });
  };

  const handleDockLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget
      .querySelectorAll<HTMLElement>('[data-dock]')
      .forEach((el) => setDockScale(el, 1));
  };

  return (
    <aside
      ref={asideRef}
      onClick={() => {
        // Expands only when clicking empty background space (desktop only)
        if (manualCollapsed && !isSmall) setManualCollapsed(false);
      }}
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-neutral-300/70 bg-[#ececec] font-mono text-[12px] text-neutral-600 ${
        collapsed ? 'w-[72px]' : 'w-[280px]'
      } ${collapsed && !isSmall ? 'cursor-pointer' : ''}`}
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
              setManualCollapsed(true);
            }}
            className='cursor-pointer text-neutral-400 hover:text-neutral-700'
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div
        onPointerMove={handleDockMove}
        onPointerLeave={handleDockLeave}
        className={`flex flex-1 flex-col overflow-y-auto overflow-x-hidden pb-2 ${
          collapsed ? 'items-center px-2 pt-3' : 'px-4 pt-4'
        }`}
      >
        {/* Workspace Switcher / Avatar (collapsed) */}
        {collapsed ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className='mb-3 flex w-full cursor-default flex-col items-center gap-3'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#404040] font-sans text-xs font-semibold text-white shadow-sm'>
              {user.initial}
            </span>
            <div className='my-1 w-full border-t border-neutral-300/80' />
          </div>
        ) : (
          <button
            onClick={(e) => e.stopPropagation()}
            className='relative mb-3 flex w-full cursor-pointer items-center justify-between rounded-xl border border-neutral-300/70 bg-[#ececec] px-3.5 py-2.5 shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] transition-colors hover:border-neutral-400'
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
          className={`flex w-full flex-col gap-2 pt-1 ${collapsed ? 'items-center' : ''}`}
        >
          {NAV.map(({ id, label, icon: Icon, to }, i) => (
            <NavLink
              key={id}
              to={to}
              data-nav
              data-dock
              title={collapsed ? label : undefined}
              aria-label={label}
              onClick={(e) => {
                e.stopPropagation(); // don't trigger the sidebar's expand-on-click
                onNavigate(id);
              }}
              // transition-colors (not transition-all) so CSS never fights GSAP's transform
              className={({ isActive }) =>
                `relative flex cursor-pointer items-center rounded-xl border-b border-b-gray-400 bg-[#ececec] transition-colors ${
                  collapsed
                    ? 'h-11 w-[52px] justify-center gap-1 px-1 py-1 text-[9px]'
                    : 'w-full px-3.5 py-2.5 text-[11px] tracking-wider'
                } ${
                  isActive
                    ? 'font-bold text-[#ff3d00]'
                    : 'text-neutral-600 hover:border-neutral-400 hover:text-[#ff3d00]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className={`absolute ${
                        collapsed ? '-left-2' : '-left-4'
                      } top-1/2 h-7 w-[3.5px] -translate-y-1/2 rounded-r bg-[#ff3d00]`}
                    />
                  )}
                  <Icon size={collapsed ? 15 : 16} strokeWidth={1.75} />
                  {collapsed ? (
                    <span
                      className={`text-[9px] font-bold ${
                        isActive ? 'text-[#ff3d00]' : 'text-neutral-400'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ) : (
                    <>
                      <span className='ml-3 flex-1 text-left'>{label}</span>
                      <span className={`text-[10px]`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div
          className={`my-4 border-t border-neutral-300/80 ${collapsed ? 'w-10' : 'w-full'}`}
        />

        {/* Search & Quick Capture */}
        {collapsed ? (
          <div className='flex w-full flex-col items-center gap-2.5'>
            <button
              aria-label='Search'
              title='Search'
              onClick={(e) => {
                e.stopPropagation();
                onSearch();
              }}
              data-dock
              className='flex h-11 w-[52px] cursor-pointer items-center justify-center rounded-xl border border-neutral-300/70 bg-[#ececec] text-neutral-600 shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] transition-colors hover:border-neutral-400 hover:text-neutral-900'
            >
              <Search size={16} strokeWidth={1.75} />
            </button>

            <button
              aria-label='Quick capture'
              title='Quick capture'
              onClick={(e) => {
                e.stopPropagation();
                onQuickCapture();
              }}
              data-dock
              className='flex h-11 w-[52px] cursor-pointer items-center justify-center rounded-xl bg-[#ff3d00] text-white shadow-[0_10px_20px_-4px_rgba(255,61,0,0.35)] transition-colors hover:bg-[#e03600]'
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
              data-dock
              className='flex w-full cursor-pointer items-center justify-between rounded-xl border-b border-b-gray-400 bg-[#ececec] px-3.5 py-2 text-[11px] tracking-wider text-neutral-600 shadow-[0_12px_20px_-6px_rgba(0,0,0,0.08)] transition-colors hover:border-neutral-400 hover:text-neutral-900'
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
              data-dock
              className='flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff3d00] text-[11px] font-bold tracking-wider text-white shadow-[0_10px_20px_-4px_rgba(255,61,0,0.35)] transition-colors hover:bg-[#e03600]'
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
                      className='flex cursor-pointer items-center gap-2 px-1 text-[11px] tracking-wider text-neutral-600 hover:text-neutral-900'
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
            {!isSmall && (
              <button
                aria-label='Expand sidebar'
                onClick={(e) => {
                  e.stopPropagation();
                  setManualCollapsed(false);
                }}
                className='cursor-pointer p-1 text-neutral-400 hover:text-neutral-700'
              >
                <ChevronRight size={18} />
              </button>
            )}
            <span
              onClick={(e) => e.stopPropagation()}
              className='flex h-9 w-9 cursor-default items-center justify-center rounded-full bg-[#404040] font-sans text-xs font-semibold text-white shadow-sm'
            >
              {user.initial}
            </span>
          </>
        ) : (
          <button
            onClick={(e) => e.stopPropagation()}
            className='flex w-full cursor-pointer items-center gap-3 text-left'
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
