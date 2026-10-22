import { useEffect, useState } from 'react';
import type { Route } from './+types/home';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Growth OS | A personal growth workspace' },
    {
      name: 'description',
      content:
        'Build practices, keep reflections, collect what teaches you, and understand your personal history.',
    },
  ];
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 32);

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  function scrollToSection(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="landing-page">
      <header className={`public-header ${scrolled ? 'is-scrolled' : ''}`}>
        <Link
          to="/"
          className="public-brand"
          aria-label="Growth OS home"
          onClick={() => setMenuOpen(false)}
        >
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
          <button onClick={() => scrollToSection('product')}>Product</button>
          <button onClick={() => scrollToSection('how-it-works')}>
            How it works
          </button>
          <button onClick={() => scrollToSection('timeline-story')}>
            Timeline
          </button>
          <button onClick={() => scrollToSection('privacy')}>Privacy</button>

          <span className="public-nav__actions">
            <Link
              to="/login"
              className="public-sign-in"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="button primary"
              onClick={() => setMenuOpen(false)}
            >
              Start your workspace
            </Link>
          </span>
        </nav>

        <button
          type="button"
          className="public-menu"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </header>

      <main id="main-content">

      </main>
    </div>
  );
}
