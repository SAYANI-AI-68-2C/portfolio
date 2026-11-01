'use client';

import { useEffect, useState } from 'react';
import { site } from '../../data/portfolio';
import { scrollToId } from '../../lib/scrollToId';
import { useTheme } from '../../lib/ThemeContext';
import styles from './Header.module.css';

const LINKS = [
  ['home',     'Home'],
  ['about',    'About'],
  ['skills',   'Skills'],
  ['projects', 'Projects'],
  ['journey',  'Journey'],
  ['contact',  'Contact'],
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track active section on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = LINKS.map(([id]) => id);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        if (id === 'home' && window.scrollY < 200) {
          setActiveSection('home');
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(id);
    scrollToId(id);
  };

  return (
    <nav className={styles.nav} aria-label="Main Navigation">
      <a
        className={styles.logo}
        href="#home"
        onClick={go('home')}
        title="Sayani Ghosal"
      >
        SG.
      </a>

      {/* Navigation links (desktop and mobile dropdown) */}
      <div className={`${styles.links} ${mobileOpen ? styles.open : ''}`}>
        {LINKS.map(([id, label]) => {
          const isActive = activeSection === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={go(id)}
              className={isActive ? styles.on : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </a>
          );
        })}
      </div>

      <div className={styles.actions}>
        {/* Theme toggle button */}
        <button
          type="button"
          className={styles.themeBtn}
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {theme === 'dark' ? (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" fill="rgba(255, 215, 0, 0.2)" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="var(--violet)"
                stroke="var(--violet)"
              />
            </svg>
          )}
        </button>

        {/* CV download */}
        <a
          href={site.resumeUrl || '/Sayani_Ghosal_Resume.pdf'}
          download="Sayani_Ghosal_Resume.pdf"
          className={styles.cvBtn}
          title="Download Resume (PDF)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>CV</span>
        </a>

        {/* Mobile menu burger button */}
        <button
          type="button"
          className={styles.burger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
