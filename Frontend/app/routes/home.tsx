import type { Route } from './+types/home';
import { Link } from 'react-router';
import { useState } from 'react';



export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Life Tracker | Growth OS' },
    {
      name: 'description',
      content:
        'Track habits, capture insights, save powerful ideas, and manage your life with Growth OS.',
    },
  ];
}

const buttonPrimary =
  'inline-flex min-h-11 items-center justify-center rounded-md bg-[#171717] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]';

const buttonSecondary =
  'inline-flex min-h-11 items-center justify-center rounded-md border border-[#D0D1D2] bg-white px-5 py-3 text-sm font-medium text-[#171A20] transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className='min-h-screen w-full overflow-x-clip bg-white text-[#171A20]'>
      {/* Header */}

      {/* Header */}
      <header className="public-header">
        <Link to="/" className="public-brand" aria-label="Growth OS home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />

            <i />
          </span>
              <span>
            Growth <em>OS</em>
                </span>
        </Link>

          <nav
            className={`public-nav ${menuOpen ? 'is-open' : ''}`}
            aria-label="Public navigation"
          >

          <a href="#product">Product</a>
          <a href="#how-it-works">How it works</a>
          <a href="#timeline-story">Timeline</a>
          <a href="#privacy">Privacy</a>

          <span className="public-nav__actions">
            <Link to="/login" className="public-sign-in">
              Sign in
            </Link>

            <Link to="/signup" className="button primary">
              Start your workspace
            </Link>
          </span>

        </nav>

        <button
        type='button'
        className='public-menu'
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Hero */}
      <section className='mx-auto  w-full max-w-6xl  grid-cols-1 items-center gap-10 px-4 pb-12 pt-28 py-12 sm:px-6 sm:pb-16 sm:pt-32 sm:py-16 md:gap-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24 lg-pt-36 lg:py-24'>
        {/* Hero copy */}

        <div className='flex min-w-0 flex-col items-start gap-8'>
          <div className='space-y-5'>
            <span className='inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1.5 text-xs font-medium text-[#333333]'>
              <span className='h-1.5 w-1.5 rounded-full bg-[#171717]' />
              Your personal growth space
            </span>

            <h1 className=' text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl'>
              Your personal system for{' '}
              <span className='text-[#171717]'>growth.</span>
            </h1>

            <p className=' text-base leading-7 text-[#5C5E62] sm:text-lg sm:leading-8'>
              Track habits, capture insights from books, save powerful ideas,
              and manage your expenses — all in one calm, minimal space built
              for real self-improvement.
            </p>
          </div>

          <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
            <Link
              to='/dashboard'
              className={`${buttonPrimary} w-full sm:w-auto`}
            >
              Start building your system
              <span aria-hidden='true' className='ml-2'>
                →
              </span>
            </Link>

            <Link
              to='/habits'
              className={`${buttonSecondary} w-full sm:w-auto`}
            >
              See how it works
            </Link>
          </div>

          {/* Benefits */}
          <div className='w-full border-t border-[#EEEEEE] pt-6'>
            <h2 className='mb-4 text-sm font-semibold'>Why use Growth OS?</h2>

            <ul className='grid grid-cols-1 gap-x-6 gap-y-4 text-sm leading-6 text-[#5C5E62] sm:grid-cols-2'>
              <li className='flex items-start gap-3'>
                <span
                  aria-hidden='true'
                  className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-xs font-semibold text-[#171717]'
                >
                  ✓
                </span>
                Built for daily use, without complicated productivity systems.
              </li>

              <li className='flex items-start gap-3'>
                <span
                  aria-hidden='true'
                  className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-xs font-semibold text-[#171717]'
                >
                  ✓
                </span>
                Keep book notes, quotes, poems, and ideas together.
              </li>

              <li className='flex items-start gap-3'>
                <span
                  aria-hidden='true'
                  className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-xs font-semibold text-[#171717]'
                >
                  ✓
                </span>
                Build habits with daily check-ins and streaks.
              </li>

              <li className='flex items-start gap-3'>
                <span
                  aria-hidden='true'
                  className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-xs font-semibold text-[#171717]'
                >
                  ✓
                </span>
                Keep expenses visible without overwhelming spreadsheets.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id='how-it-works'
        className='border-y border-[#EEEEEE] bg-[#FAFAFA]'
      >
        <div className='mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8'>
          <div className='mx-auto mb-10 max-w-3xl text-center sm:mb-12'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#171717]'>
              A simpler approach
            </p>

            <h2 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              Make growth a daily practice.
            </h2>

            <p className='mt-4 text-sm leading-6 text-[#5C5E62] sm:text-base sm:leading-7'>
              A place to capture what matters, stay consistent, and reflect on
              the person you are becoming.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
            <article className='h-full rounded-xl border border-[#E8E8E8] bg-white p-6 sm:p-7'>
              <span className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#F2F2F2] text-sm font-semibold text-[#171717]'>
                01
              </span>

              <h3 className='mt-5 text-lg font-semibold'>Capture</h3>

              <p className='mt-2 text-sm leading-6 text-[#5C5E62]'>
                Save book notes, quotes, poems, and ideas the moment they hit
                you. Build a personal library worth returning to.
              </p>
            </article>

            <article className=' rounded-xl border border-[#E8E8E8] bg-white p-6 sm:p-7 h-full '>
              <span className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#F2F2F2] text-sm font-semibold text-[#171717]'>
                02
              </span>

              <h3 className='mt-5 text-lg font-semibold'>Track</h3>

              <p className='mt-2 text-sm leading-6 text-[#5C5E62]'>
                Check in on your habits, maintain your streaks, and make
                consistency easier to see.
              </p>
            </article>

            <article className='rounded-xl border border-[#E8E8E8] bg-white p-6 sm:p-7 sm:col-span-2 lg:col-span-1 h-full'>
              <span className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#F2F2F2] text-sm font-semibold text-[#171717]'>
                03
              </span>

              <h3 className='mt-5 text-lg font-semibold'>Reflect</h3>

              <p className='mt-2 text-sm leading-6 text-[#5C5E62]'>
                Review your progress, reconnect with your priorities, and decide
                what deserves your attention next.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='rounded-2xl border border-[#E8E8E8] bg-white px-5 py-12 text-center sm:px-10 sm:py-16'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#171717]'>
            Start where you are
          </p>

          <h2 className='mx-auto  text-3xl font-semibold tracking-tight sm:text-4xl'>
            Start with what matters today.
          </h2>

          <p className='mx-auto mt-4  text-sm leading-6 text-[#5C5E62] sm:text-base sm:leading-7'>
            Habits and Library are live. Expenses and Inspiration are coming
            next.
          </p>

          <Link to='/dashboard' className={`${buttonPrimary} mt-7`}>
            Open Growth OS
            <span aria-hidden='true' className='ml-2'>
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-[#EEEEEE]'>
        <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-[#777777] sm:flex-row sm:px-6 sm:text-left lg:px-8'>
          <span className='font-medium text-[#393C41]'>Growth OS.</span>
          <span>A little progress, every day.</span>
        </div>
      </footer>
    </main>
  );
}
