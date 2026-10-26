import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

interface AuthLayoutProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  eyebrow,
  title,
  description,
  children,
}) => {
  return (
    <main className="auth-page" id="main-content">
      <header className="auth-header">
        <Link className="auth-brand" to="/" aria-label="Growth OS home">
          <span className="auth-brand__mark" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>Growth <em>OS</em></span>
        </Link>
        <Link className="auth-back" to="/">
          Back to overview <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </header>

      <div className="auth-layout">
        <section className="auth-visual" aria-label="About Growth OS">
          <span className="auth-eyebrow">PERSONAL HISTORY / SOURCE MAP</span>
          <h2>A place for what<br />changes over time.</h2>

          <svg className="auth-visual__map" viewBox="0 0 540 410" fill="none" aria-hidden="true">
            <path
              className="auth-map-grid"
              d="M20 60H520M20 140H520M20 220H520M20 300H520M100 20V390M210 20V390M320 20V390M430 20V390"
            />
            <path className="auth-map-path" d="M24 340H112V286H228V302H338V188H446V94H518" />
            <circle cx="112" cy="286" r="5" />
            <circle cx="228" cy="302" r="5" />
            <circle cx="338" cy="188" r="5" />
            <circle className="auth-map-active" cx="446" cy="94" r="6" />
          </svg>

          <p>Habits, reflections, resources, and milestones remain connected to their source.</p>
          <div className="auth-visual__footer">
            <span><i /> A PRIVATE SPACE TO GROW</span>
            <span>GOS / 001</span>
          </div>
        </section>

        <section className="auth-form-panel" aria-labelledby="auth-heading">
          <div className="auth-form-wrap">
            <span className="auth-eyebrow">{eyebrow}</span>
            <h1 id="auth-heading">{title}</h1>
            <p className="auth-intro">{description}</p>
            {children}
          </div>
          <footer className="auth-legal">
            <span>GROWTH OS / PERSONAL WORKSPACE</span>
            <span>© {new Date().getFullYear()} Growth OS</span>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
