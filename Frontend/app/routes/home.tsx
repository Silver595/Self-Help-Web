import { useEffect, useState } from 'react';
import type { Route } from './+types/home';
import { Link } from 'react-router';

const productViews = [
  ['Today', 'One calm place for the next useful action.'],
  ['Habits', 'Repeatable practices without punishment-based streaks.'],
  ['Library', 'A personal archive for what teaches you.'],
  ['Journal', 'Reflections connected to the things that inspired them.'],
  ['Timeline', 'A trustworthy history of actions, thoughts, and learning.'],
  ['Insights', 'Evidence-based patterns with their source data attached.'],
] as const;

const workflow = [
  ['01', 'Capture', 'Complete a habit, write a thought, or save a resource.'],
  ['02', 'Connect', 'Keep sources and related records attached.'],
  ['03', 'Understand', 'Review recorded patterns in Timeline and Insights.'],
  ['04', 'Return', 'Revisit what changed and what still matters.'],
];

const historyEvents = [
  ['08:42', 'Reading marked complete', '20 minutes · Reading habit'],
  ['08:42', 'Today progress updates', 'One of four practices'],
  ['08:43', 'Timeline event appears', 'Source remains attached'],
  ['20:04', 'Reflection adds context', 'Atomic Habits · What stayed with me'],
];

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
  const [selectedView, setSelectedView] = useState(4);

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
        <section className="landing-hero" id="home">
          <div className="landing-hero__copy">
            <span className="eyebrow">A personal growth workspace</span>

            <h1>
              See your growth
              <br />
              in context.
            </h1>

            <p>
              Build practices, keep reflections, collect what teaches you, and
              return to a connected history of how your life is changing.
            </p>

            <div className="landing-hero__actions">
              <Link to="/signup" className="button primary">
                Start your workspace
              </Link>
              <button
                className="button"
                onClick={() => scrollToSection('timeline-story')}
              >
                Explore the Timeline <span aria-hidden="true">↗</span>
              </button>
            </div>

            <span className="landing-privacy">
              <i />
              Private by design · Your records remain yours
            </span>
          </div>

          <div
            className="landing-map"
            aria-label="Illustration of connected personal history"
          >
            <span className="landing-map__label">
              PERSONAL HISTORY / CONNECTED RECORDS
            </span>

            <svg
              className="landing-map__svg"
              viewBox="0 0 720 430"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="landing-map__grid"
                d="M30 50H690M30 130H690M30 210H690M30 290H690M30 370H690M110 20V410M250 20V410M390 20V410M530 20V410M670 20V410"
              />
              <path
                className="landing-map__path"
                d="M40 350H142V284H282V308H416V178H548V96H680"
              />
              <path
                className="landing-map__relation"
                d="M142 284C196 224 228 201 282 146M416 178C461 232 500 246 548 250M282 308C346 362 443 370 548 250"
              />
              <circle className="map-point" cx="142" cy="284" r="5" />
              <circle className="map-point" cx="282" cy="146" r="5" />
              <circle className="map-point" cx="416" cy="178" r="5" />
              <circle className="map-point map-point--active" cx="548" cy="250" r="6" />
            </svg>

            <div className="landing-map__node node-a">
              <i />
              <span>
                <small>08:42 / HABIT</small>
                <strong>Reading complete</strong>
              </span>
            </div>

            <div className="landing-map__node node-b">
              <i />
              <span>
                <small>20:04 / JOURNAL</small>
                <strong>What stayed with me</strong>
              </span>
            </div>

            <div className="landing-map__node node-c">
              <i />
              <span>
                <small>SOURCE / BOOK</small>
                <strong>Atomic Habits</strong>
              </span>
            </div>

            <div className="landing-map__node node-d is-active">
              <i />
              <span>
                <small>PROGRESS / 01</small>
                <strong>10 reading sessions</strong>
              </span>
            </div>

            <div className="landing-map__activity">
              <span>ACTIVITY / RECENT</span>
              <div className="activity-grid" aria-label="Illustrative activity grid">
                {Array.from({ length: 35 }, (_, index) => (
                  <i
                    key={index}
                    className={
                      [1, 3, 4, 8, 9, 14, 15, 18, 21, 22, 27, 29, 32].includes(
                        index,
                      )
                        ? 'has-data'
                        : ''
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            className="landing-scroll"
            onClick={() => scrollToSection('how-it-works')}
          >
            <span>Continue</span>
            <span aria-hidden="true">↓</span>
          </button>
        </section>

        <section className="landing-section workflow-section" id="how-it-works">
          <header className="landing-section__header">
            <span className="eyebrow">[01] HOW IT CONNECTS</span>
            <h2>
              One record, built
              <br />
              from meaningful actions.
            </h2>
          </header>

          <div className="workflow-line">
            {workflow.map(([index, title, copy]) => (
              <article key={index}>
                <span>{index}</span>
                <i />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section product-section" id="product">
          <header className="landing-section__header">
            <span className="eyebrow">[02] SIX VIEWS, ONE HISTORY</span>
            <h2>Not six disconnected tools.</h2>
            <p>Six ways to understand the same personal record.</p>
          </header>

          <div className="product-walkthrough">
            <div className="product-index" role="tablist" aria-label="Product views">
              {productViews.map(([title, copy], index) => (
                <button
                  key={title}
                  type="button"
                  role="tab"
                  aria-selected={selectedView === index}
                  className={selectedView === index ? 'is-active' : ''}
                  onClick={() => setSelectedView(index)}
                >
                  <span>0{index + 1}</span>
                  <strong>{title}</strong>
                  <span className="product-index__arrow" aria-hidden="true">
                    ↗
                  </span>
                  <small>{copy}</small>
                </button>
              ))}
            </div>

            <div className="product-preview" role="tabpanel">
              <div className="product-preview__top">
                <span className="product-preview__status" />
                Growth OS / {productViews[selectedView][0]}
                <b>PRODUCT VIEW</b>
              </div>

              <div className="product-preview__canvas">
                <span className="eyebrow">
                  {selectedView === 4
                    ? 'YOUR PERSONAL HISTORY'
                    : `VIEW 0${selectedView + 1}`}
                </span>
                <h3>{productViews[selectedView][0]}</h3>
                <p>{productViews[selectedView][1]}</p>

                <div
                  className={`preview-diagram preview-diagram--${selectedView}`}
                  aria-hidden="true"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <i key={index} />
                  ))}
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section history-section" id="timeline-story">
          <header className="landing-section__header">
            <span className="eyebrow">[03] ACTION BECOMES HISTORY</span>
            <h2>
              A small action stays
              <br />
              connected to its meaning.
            </h2>
          </header>

          <div className="history-sequence">
            {historyEvents.map(([time, title, copy], index) => (
              <article key={`${time}-${title}`}>
                <span>{time}</span>
                <i>{String(index + 1).padStart(2, '0')}</i>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section evidence-section" id="insights-preview">
          <header className="landing-section__header">
            <span className="eyebrow">[04] INSIGHTS WITH CONTEXT</span>
            <h2>Evidence, not pressure.</h2>
            <p>
              Useful statistics describe what was recorded. They do not turn a
              missed day into a verdict.
            </p>
          </header>

          <div className="evidence-preview">
            <div className="evidence-activity">
              <span className="eyebrow">ACTIVITY / SAMPLE VIEW</span>
              <div className="activity-grid" aria-hidden="true">
                {Array.from({ length: 70 }, (_, index) => (
                  <i
                    key={index}
                    className={
                      [2, 3, 7, 11, 12, 18, 19, 24, 28, 29, 35, 42, 43, 49, 56, 61, 66].includes(
                        index,
                      )
                        ? 'has-data'
                        : ''
                    }
                  />
                ))}
              </div>
              <small>Illustrative layout, not your actual activity data.</small>
            </div>

            <div className="evidence-statement">
              <span>OBS / 01</span>
              <strong>
                Your progress should explain what happened, not judge you for
                it.
              </strong>
              <small>Patterns should remain connected to their source records.</small>
            </div>
          </div>
        </section>

        <section className="landing-section privacy-section" id="privacy">
          <span className="eyebrow">[05] YOUR RECORDS, YOUR CONTROL</span>
          <div>
            <h2>A workspace that respects the life inside it.</h2>
            <p>
              Clear source relationships. Reversible low-risk actions. No
              guilt-driven warnings or manipulative engagement language.
            </p>
          </div>
        </section>

        <section className="landing-final">
          <span className="eyebrow">START WHERE YOU ARE</span>
          <h2>Start with one useful action.</h2>
          <p>
            Complete a practice, write a thought, or save something worth
            returning to.
          </p>
          <div>
            <Link to="/signup" className="button primary">
              Create your workspace
            </Link>
            <Link to="/login" className="button">
              Sign in
            </Link>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="public-footer__brand">
          <Link to="/" className="public-brand">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              Growth <em>OS</em>
            </span>
          </Link>
          <p>A measured record of a growing life.</p>
        </div>

        <div>
          <strong>Product</strong>
          <button onClick={() => scrollToSection('product')}>Product views</button>
          <button onClick={() => scrollToSection('timeline-story')}>Timeline</button>
          <button onClick={() => scrollToSection('insights-preview')}>Insights</button>
        </div>

        <div>
          <strong>Resources</strong>
          <button onClick={() => scrollToSection('how-it-works')}>
            How it works
          </button>
          <button onClick={() => scrollToSection('privacy')}>Privacy</button>
          <span>Accessibility</span>
        </div>

        <div>
          <strong>Account</strong>
          <Link to="/login">Sign in</Link>
          <Link to="/signup">Create account</Link>
          <span>© 2026 Growth OS</span>
        </div>
      </footer>
    </div>
  );
}
