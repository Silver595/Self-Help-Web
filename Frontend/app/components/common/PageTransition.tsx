import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useOutlet } from 'react-router';
import gsap from 'gsap';

/**
 * GSAP version of the 3-step horizontal curtain.
 *
 *  cover  : 3 bands slide in from the left, top to bottom
 *  swap   : fully covered, page is swapped synchronously, then a short hold
 *  reveal : bands slide out to the right, top to bottom
 *
 * Requires: npm i gsap
 */

const STEPS = 3;
const DURATION = 0.3; // seconds per band
const STAGGER = 0.03; // seconds between bands
const HOLD = 0.10; // pause after the swap, lets the new page paint
const EASE = 'power4.inOut';
const COLOR = '#434341';

type Phase = 'idle' | 'cover' | 'reveal';

export default function PageTransition() {
  const outlet = useOutlet();
  const { pathname } = useLocation();

  const [trackedPath, setTrackedPath] = useState(pathname);
  const [phase, setPhase] = useState<Phase>('idle');
  const lastStable = useRef(outlet);
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Detect the route change during render so the new page never paints before the curtain
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

  // Register the starting state with GSAP, and clean up on unmount
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const bands = root.querySelectorAll('[data-band]');
    const extras = root.querySelectorAll('[data-extra]');
    gsap.set(bands, {
      scaleX: 0,
      transformOrigin: 'left center',
      force3D: true,
    });
    gsap.set(extras, { opacity: 0 });
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  // Build the whole cover -> swap -> reveal sequence as ONE timeline
  useEffect(() => {
    if (phase !== 'cover') return;
    const root = rootRef.current;
    if (!root) return;
    const bands = root.querySelectorAll('[data-band]');
    const extras = root.querySelectorAll('[data-extra]');

    tlRef.current?.kill(); // interrupted by a new navigation

    // Only reset the origin if the bands are fully retracted
    if ((gsap.getProperty(bands[0], 'scaleX') as number) === 0) {
      gsap.set(bands, { transformOrigin: 'left center' });
    }

    const tl = gsap.timeline();
    tl.to(bands, {
      scaleX: 1,
      duration: DURATION,
      ease: EASE,
      stagger: STAGGER,
      force3D: true,
    })
      .to(extras, { opacity: 1, duration: 0.15 }, '>-0.1')
      .add(() => {
        // Fully covered: swap the page synchronously so it is mounted before the reveal
        window.scrollTo(0, 0);
        flushSync(() => setPhase('reveal'));
      })
      .set(extras, { opacity: 0 }, `+=${HOLD}`)
      .set(bands, { transformOrigin: 'right center' })
      .to(bands, {
        scaleX: 0,
        duration: DURATION,
        ease: EASE,
        stagger: STAGGER,
      })
      .add(() => {
        gsap.set(bands, { transformOrigin: 'left center' });
        setPhase('idle');
      });

    tlRef.current = tl;
    // no cleanup here: the swap changes `phase`, which would kill this very timeline
  }, [phase]);

  return (
    <>
      {content}

      <div
        ref={rootRef}
        aria-hidden='true'
        className='fixed inset-0 z-[100] overflow-hidden'
        style={{ pointerEvents: phase === 'idle' ? 'none' : 'auto' }}
      >
        <div
          className='grid h-full w-full'
          style={{ gridTemplateRows: `repeat(${STEPS}, 1fr)` }}
        >
          {Array.from({ length: STEPS }, (_, i) => (
            <div
              key={i}
              data-band
              style={{
                height: 'calc(100% + 1px)', // overlap to avoid hairline gaps
                background: COLOR,
                transform: 'scaleX(0)', // hidden before GSAP takes over (no flash on load)
                transformOrigin: 'left center',
                willChange: 'transform',
              }}
            />
          ))}
        </div>

        <span
          data-extra
          className='absolute right-6 top-4 h-1.5 w-1.5 bg-[#ff3d00]'
          style={{ opacity: 0 }}
        />
        <span
          data-extra
          className='absolute bottom-4 left-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70'
          style={{ opacity: 0 }}
        >
          Growth OS / Loading
        </span>
      </div>
    </>
  );
}
