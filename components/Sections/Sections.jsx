'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { site } from '../../data/portfolio';
import SkillIcon from '../SkillIcon/SkillIcon';
import { useFloatingCards } from '../../lib/useFloatingCards';
import styles from './Sections.module.css';

// Load 3D canvases lazily – keeps TTI low
const Interactive3DCanvas = dynamic(
  () => import('../Interactive3D/Interactive3DCanvas'),
  { ssr: false, loading: () => <div style={{ height: 420 }} /> }
);

const NeuralMesh = dynamic(
  () => import('../NeuralMesh/NeuralMesh'),
  { ssr: false }
);

/* ── tiny helper: mailto form submit ── */
function useContactForm() {
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const bind = (k) => ({
    value: form[k],
    onChange: (e) => setForm(f => ({ ...f, [k]: e.target.value })),
  });
  const onSubmit = (e) => {
    e.preventDefault();
    if (!site.email) { setMsg('Contact email not configured.'); return; }
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body    = encodeURIComponent(`${form.message}\n\n${form.email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setMsg('Opening your email app…');
  };
  return { msg, form, bind, onSubmit };
}

export default function Sections() {
  const { msg, bind, onSubmit } = useContactForm();
  useFloatingCards();

  return (
    <div className={styles.root}>
      {/* 3D Interactive Neural Mesh Background across all sections from page 2 */}
      <NeuralMesh />

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section id="about" className={styles.section}>
        <div className={styles.wrap}>
          <p className={`${styles.eyebrow} sg-reveal`}>About</p>
          <h2 className={`${styles.h2} sg-reveal sg-d1`}>Beyond the <em>Code.</em></h2>
          <p className={`${styles.lead} sg-reveal sg-d2`}>{site.summary}</p>

          <div className={styles.cards}>
            {site.about.map(([t, d], i) => (
              <div key={t} className={`${styles.glass} sg-reveal sg-d${i + 2}`}>
                <b>{t}</b><span>{d}</span>
              </div>
            ))}
          </div>

          {/* Interactive 3D globe inside about section */}
          <div className="sg-reveal sg-d4">
            <Interactive3DCanvas />
          </div>
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────────────────────── */}
      <section id="skills" className={styles.section}>
        <div className={styles.wrap}>
          <p className={`${styles.eyebrow} sg-reveal`}>Skills</p>
          <h2 className={`${styles.h2} sg-reveal sg-d1`}>My Digital <em>Arsenal.</em></h2>
          <div className={styles.grid}>
            {Object.entries(site.skills).map(([cat, items], i) => (
              <div key={cat} className={`${styles.glass} sg-scale sg-d${(i % 6) + 1}`}>
                <h3>{cat}</h3>
                <div className={styles.chips}>
                  {items.map(s => (
                    <span key={s} className={styles.skillChip}>
                      <SkillIcon name={s} size={16} />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ───────────────────────────────────────── */}
      <section id="projects" className={styles.section}>
        <div className={styles.wrap}>
          <p className={`${styles.eyebrow} sg-reveal`}>Projects</p>
          <h2 className={`${styles.h2} sg-reveal sg-d1`}>Things I've <em>Built.</em></h2>
          <div className={styles.grid}>
            {site.projects.map((p, i) => (
              <article
                key={p.name}
                className={`${styles.glass} ${styles.project} ${p.highlight ? styles.featured : ''} sg-reveal sg-d${i + 1}`}
              >
                {p.image && (
                  <div className={styles.projectImageWrap}>
                    <img
                      src={p.image}
                      alt={`${p.name} preview`}
                      className={styles.projectImage}
                      loading="lazy"
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                )}
                <div className={styles.projectMeta}>
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.date}>{p.date}</span>
                </div>
                <h3>{p.name}</h3>
                <small>{p.category}</small>
                <p>{p.description}</p>
                <div className={styles.chips}>
                  {p.tags.map(t => <span key={t}>{t}</span>)}
                </div>
                {(p.demo || p.repo) && (
                  <div className={styles.links}>
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY / TIMELINE ─────────────────────────────── */}
      <section id="journey" className={styles.section}>
        <div className={styles.wrap}>
          <p className={`${styles.eyebrow} sg-reveal`}>Journey</p>
          <h2 className={`${styles.h2} sg-reveal sg-d1`}>The Journey <em>So Far.</em></h2>

          <div className={styles.timeline}>
            {site.journey.map((item, i) => (
              <div
                key={item.title}
                className={`${styles.timelineItem} ${i % 2 === 0 ? 'sg-reveal-left' : 'sg-reveal-right'} sg-d${(i % 4) + 1}`}
              >
                <div className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.timelineContent}>
                  <span className={styles.timelinePeriod}>{item.period}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <h3 className={`${styles.sub} sg-reveal`}>Achievements</h3>
          <div className={styles.achieveGrid}>
            {site.achievements.map((a, i) => (
              <div key={a.title} className={`${styles.glass} ${styles.achieve} sg-scale sg-d${(i % 4) + 1}`}>
                <span className={styles.trophy} aria-hidden="true">🏆</span>
                <div>
                  <b>{a.title}</b>
                  <span>{a.event}</span>
                  <small>{a.date}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <h3 className={`${styles.sub} sg-reveal`}>Certifications</h3>
          <div className={styles.certGrid}>
            {site.certs.map((c, i) => (
              <div key={c.name} className={`${styles.glass} ${styles.cert} sg-reveal sg-d${(i % 6) + 1}`}>
                <b>{c.name}</b>
                {c.issuer && <span>{c.issuer}</span>}
                <small>{c.date}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────── */}
      <section id="contact" className={styles.section}>
        <div className={`${styles.wrap} ${styles.narrow}`}>
          <p className={`${styles.eyebrow} sg-reveal`}>Contact &amp; Resume</p>
          <h2 className={`${styles.h2} sg-reveal sg-d1`}>Have an Idea? <em>Let's Build It.</em></h2>

          <div className={`${styles.contactInfo} sg-reveal sg-d2`}>
            {site.location && <span>📍 {site.location}</span>}
            {site.email   && <a href={`mailto:${site.email}`}>✉️ {site.email}</a>}
          </div>

          {/* CV download buttons */}
          <div className={`${styles.resumeActions} sg-reveal sg-d3`}>
            <a
              href={site.resumeUrl || '/Sayani_Ghosal_Resume.pdf'}
              download="Sayani_Ghosal_Resume.pdf"
              className={styles.downloadCvPrimary}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download CV (PDF)</span>
            </a>
            {site.resumeDocx && (
              <a
                href={site.resumeDocx}
                download="Sayani_Ghosal_ATS_Resume_v2.docx"
                className={styles.downloadCvSecondary}
                title="Download DOCX format"
              >
                Download .DOCX
              </a>
            )}
          </div>

          <div className={`${styles.socials} sg-reveal sg-d4`}>
            {site.github   && <a href={site.github}            target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
            {site.linkedin && <a href={site.linkedin}          target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
            {site.email    && <a href={`mailto:${site.email}`}>Email me ↗</a>}
          </div>

          <form className={`${styles.form} sg-reveal sg-d5`} onSubmit={onSubmit}>
            <input placeholder="Your name"   aria-label="Your name"  required {...bind('name')} />
            <input type="email" placeholder="Your email"  aria-label="Your email" required {...bind('email')} />
            <textarea placeholder="What are you building?" aria-label="Message" rows={5} required {...bind('message')} />
            <button type="submit">Send message</button>
            {msg && <p role="status" className={styles.note}>{msg}</p>}
          </form>

          <p className={`${styles.close} sg-reveal sg-d6`}>
            Every great idea starts with curiosity. Let's turn yours into something extraordinary.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Sayani Ghosal · Kolkata, India
      </footer>
    </div>
  );
}
