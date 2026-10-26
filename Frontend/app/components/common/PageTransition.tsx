import { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router';

/**
 * Staircase "curtain" transition between routes.
 *
 *  1. cover  : 3 dark bands slide in from the left, top to bottom (stepped edge)
 *  2. hold   : screen is fully dark, the page underneath is swapped
 *  3. reveal : bands slide out to the right, top to bottom, uncovering the new page
 *
 * Put it in root.tsx in place of <Outlet />.
 */

const STEPS = 3; // number of horizontal bands
const STAGGER_MS = 90; // delay between bands
const STEP_MS = 380; // duration of each band
const HOLD_MS = 140; // fully-covered pause (the page swaps here)
const COLOR = '#434341';
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

const WIPE_MS = STEP_MS + STAGGER_MS * (STEPS - 1);

type Phase = 'idle' | 'cover' | 'reveal';

export default function PageTransition() {
  const outlet = useOutlet();
  const { pathname } = useLocation();

  const [trackedPath, setTrackedPath] = useState(pathname);
  const [phase, setPhase] = useState<Phase>('idle');
  const lastStable = useRef(outlet);

  // Detect a route change *during render*, so the new page never paints before the curtain
  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setPhase('cover');
  }

  // While covering, keep showing the page we are leaving
  const showOld = phase === 'cover' || pathname !== trackedPath;
  if (!showOld) lastStable.current = outlet;
  const content = showOld ? lastStable.current : outlet;

  useEffect(() => {
    if (phase === 'cover') {
      const t = window.setTimeout(() => {
        window.scrollTo(0, 0);
        setPhase('reveal');
      }, WIPE_MS + HOLD_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === 'reveal') {
      const t = window.setTimeout(() => setPhase('idle'), WIPE_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  return (
    <>
      {content}

      <div
        aria-hidden='true'
        className='fixed inset-0 z-[100] overflow-hidden'
        style={{ pointerEvents: phase === 'idle' ? 'none' : 'auto' }}
      >
        {/* Solid plug: fills any seam between bands while the screen is fully covered */}
        <div
          className='absolute inset-0'
          style={{
            background: COLOR,
            opacity: 0,
            transition: 'none',
            visibility: phase === 'cover' ? 'visible' : 'hidden',
            transitionDelay: '0ms',
            // becomes visible only after every band has landed
            animation: phase === 'cover' ? `plugIn 0ms linear ${WIPE_MS}ms both` : 'none',
          }}
        />
        <style>{`@keyframes plugIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

        <div
          className='grid h-full w-full'
          style={{ gridTemplateRows: `repeat(${STEPS}, 1fr)` }}
        >
          {Array.from({ length: STEPS }, (_, i) => (
            <div
              key={i}
              style={{
                height: 'calc(100% + 1px)', // overlap to avoid hairline gaps
                background: COLOR,
                willChange: 'transform',
                transform: `scale3d(${phase === 'cover' ? 1 : 0}, 1, 1)`,
                backfaceVisibility: 'hidden',
                transformOrigin: phase === 'reveal' ? 'right' : 'left',
                transition: `transform ${STEP_MS}ms ${EASE} ${i * STAGGER_MS}ms`,
              }}
            />
          ))}
        </div>

        {/* Small brand details visible while fully covered */}
        <span
          className='absolute right-6 top-4 h-1.5 w-1.5 bg-[#ff3d00] transition-opacity duration-200'
          style={{ opacity: phase === 'cover' ? 1 : 0, transitionDelay: phase === 'cover' ? `${WIPE_MS}ms` : '0ms' }}
        />
        <span
          className='absolute bottom-4 left-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 transition-opacity duration-200'
          style={{ opacity: phase === 'cover' ? 1 : 0, transitionDelay: phase === 'cover' ? `${WIPE_MS}ms` : '0ms' }}
        >
          Growth OS / Loading
        </span>
      </div>
    </>
  );
}