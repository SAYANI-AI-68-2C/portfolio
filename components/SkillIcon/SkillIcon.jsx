'use client';

/**
 * SkillIcon renders authentic, recognizable vector logos for every skill
 * in Sayani Ghosal's portfolio.
 */
export default function SkillIcon({ name, className = '', size = 18 }) {
  const s = size;

  switch (name) {
    // ── Programming Languages ─────────────────────────────
    case 'Python':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M11.9 2C6.9 2 7.2 4.2 7.2 4.2l.01 2.2h4.8v.7H5.2S2 6.7 2 11.8s2.8 4.9 2.8 4.9h1.7v-2.4s-.1-2.8 2.8-2.8h4.7s2.7.1 2.7-2.6V4.7S17 2 11.9 2zm-1.4 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="#3776AB"/>
          <path d="M12.1 22c5 0 4.7-2.2 4.7-2.2l-.01-2.2H12v-.7h6.8s3.2.4 3.2-4.7-2.8-4.9-2.8-4.9h-1.7v2.4s.1 2.8-2.8 2.8H10s-2.7-.1-2.7 2.6v4.2S7 22 12.1 22zm1.4-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="#FFD43B"/>
        </svg>
      );

    case 'C / C++':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2z" fill="#00599C"/>
          <path d="M12 4.2l7.8 4.3v7L12 19.8l-7.8-4.3v-7L12 4.2z" fill="#004482"/>
          <path d="M12.2 8.5c-2 0-3.3 1.5-3.3 3.5s1.3 3.5 3.3 3.5c1.4 0 2.4-.8 2.8-1.9h-1.7c-.2.4-.6.6-1.1.6-1 0-1.7-.8-1.7-2.2s.7-2.2 1.7-2.2c.5 0 .9.2 1.1.6h1.7c-.4-1.1-1.4-1.9-2.8-1.9zm4 2.2v1.1h-1.1v.9h1.1v1.1h.9v-1.1h1.1v-.9h-1.1v-1.1h-.9zm3 0v1.1h-1.1v.9h1.1v1.1h.9v-1.1h1.1v-.9h-1.1v-1.1h-.9z" fill="#FFFFFF"/>
        </svg>
      );

    case 'Java':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M8.2 17.5s-1.8.4.5.6c2.8.2 4.3.1 7.3-.3 0 0 .9.6 1.8.8-5.7 1.7-12.8.1-9.6-1.1M7.4 15.2s-1.5.6.8.8c2.9.2 5.5.2 9.5-.4 0 0 .7.5 1.4.7-6.5 1.5-14.7.4-11.7-1.1M10.8 11.2s-2.1.2-1.5 1.5c1.1 2.2 4.1 1.2 5.9.8.7-.1 1.4.2 1.4.2s-.7-.4-.9-.5c-.8-.4-1.6-.5-2.7-.4-1.5.1-2.9.4-2.2-1.6M14 6.8c1.3 1.3.4 2.6.4 2.6s2.3-1.2 1.2-2.7c-1-1.4-1.9-2.1-4-3.7 0 0 .9 1.4 2.4 3.8M17.1 13.8c.8.6 3.1.3 3.1.3s-1.2-.8-2.6-1c-1.3-.2-2 .1-2 .1s.6-.1 1.5.6M12.9 2.5s2 2 0 4.3c-1.6 1.8-1.1 2.8.5 4-1.4-.4-2.8-1.5-2.1-2.9.9-1.8 2.6-2.6 1.6-5.4" fill="#E76F00"/>
          <path d="M5.5 20.3c4.8 1.1 12.3.6 14.5-.4.8-.4 1.3-.9 1.3-.9s-.3.5-.9.8c-2.4 1.1-10.4 1.6-15.8.4-.7-.2-.9-.4-.9-.4s.8.3 1.8.5" fill="#5382A1"/>
        </svg>
      );

    case 'JavaScript':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
          <path d="M6 19.5l1.8-1.1c.4.7.8 1.3 1.7 1.3.9 0 1.4-.4 1.4-1.2v-6.3h2.3v6.3c0 1.9-1.2 2.8-3.4 2.8-1.8 0-3-.9-3.8-1.8zm8.6-.2l1.8-1.1c.5.8 1.2 1.4 2.3 1.4 1 0 1.6-.5 1.6-1.1 0-.8-.7-1.1-1.9-1.6l-.7-.3c-1.9-.8-3.2-1.8-3.2-3.8 0-1.9 1.5-3.3 3.8-3.3 1.6 0 2.8.6 3.6 2l-1.7 1.1c-.4-.7-.9-1.1-1.9-1.1-.9 0-1.5.5-1.5 1.1 0 .7.6 1 1.7 1.5l.7.3c2.2.9 3.5 1.8 3.5 3.9 0 2.2-1.7 3.5-4.2 3.5-2.3 0-3.8-1.1-4.6-2.7z" fill="#000000"/>
        </svg>
      );

    // ── AI & Machine Learning ─────────────────────────────
    case 'Machine Learning':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <circle cx="6" cy="6" r="2.5" fill="#9B7BFF"/>
          <circle cx="6" cy="18" r="2.5" fill="#9B7BFF"/>
          <circle cx="18" cy="12" r="2.5" fill="#55E6FF"/>
          <circle cx="12" cy="6" r="1.8" fill="#55E6FF"/>
          <circle cx="12" cy="18" r="1.8" fill="#55E6FF"/>
          <line x1="8.5" y1="6" x2="10.2" y2="6" stroke="#55E6FF"/>
          <line x1="8.5" y1="18" x2="10.2" y2="18" stroke="#55E6FF"/>
          <line x1="8" y1="7.5" x2="16" y2="11" stroke="#9B7BFF"/>
          <line x1="8" y1="16.5" x2="16" y2="13" stroke="#9B7BFF"/>
          <line x1="13.5" y1="7" x2="16.5" y2="10.5" stroke="#55E6FF"/>
          <line x1="13.5" y1="17" x2="16.5" y2="13.5" stroke="#55E6FF"/>
        </svg>
      );

    case 'Deep Learning':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
          <circle cx="5" cy="7" r="2" fill="#55E6FF"/>
          <circle cx="5" cy="17" r="2" fill="#55E6FF"/>
          <circle cx="12" cy="5" r="2" fill="#9B7BFF"/>
          <circle cx="12" cy="12" r="2" fill="#9B7BFF"/>
          <circle cx="12" cy="19" r="2" fill="#9B7BFF"/>
          <circle cx="19" cy="8" r="2" fill="#55E6FF"/>
          <circle cx="19" cy="16" r="2" fill="#55E6FF"/>
          <path d="M7 7l3-1.5M7 7l3 4.5M7 17l3-4.5M7 17l3 1.5M14 5l3 2.5M14 12l3-3.5M14 12l3 3.5M14 19l3-2.5" stroke="currentColor" opacity="0.6"/>
        </svg>
      );

    case 'Computer Vision':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="#55E6FF"/>
          <circle cx="12" cy="12" r="3.2" stroke="#9B7BFF" fill="rgba(155, 123, 255, 0.25)"/>
          <path d="M7 4h-3v3M17 4h3v3M7 20h-3v-3M17 20h3v-3" stroke="#55E6FF" strokeWidth="1.5"/>
        </svg>
      );

    case 'TensorFlow':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 2L3 7.2v9.6l3.8-2.2V9.4l5.2-3v14.4l3.8-2.2V4.2L12 2z" fill="#FF6F00"/>
          <path d="M15.8 4.2l5.2 3v9.6l-3.8-2.2V9.4l-1.4-.8V4.2z" fill="#FFA800"/>
        </svg>
      );

    case 'Keras':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#D00000"/>
          <path d="M6 5.5h3.4v5.4l5-5.4h4.4l-5.6 5.8 6 7.2h-4.4l-4.1-5.2-1.3 1.3V18.5H6V5.5z" fill="#FFFFFF"/>
        </svg>
      );

    case 'OpenCV':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="6.5" r="4" stroke="#ED1C24" strokeWidth="2.2" strokeDasharray="18 6"/>
          <circle cx="6.5" cy="16" r="4" stroke="#00A651" strokeWidth="2.2" strokeDasharray="18 6"/>
          <circle cx="17.5" cy="16" r="4" stroke="#0072BC" strokeWidth="2.2" strokeDasharray="18 6"/>
        </svg>
      );

    case 'Fraud Detection':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9B7BFF" fill="rgba(155, 123, 255, 0.15)"/>
          <path d="m9 12 2 2 4-4" stroke="#55E6FF"/>
        </svg>
      );

    case 'Anomaly Detection':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M3 12h4l2-6 3 12 2-8 2 5 2-3h3" stroke="#55E6FF"/>
          <circle cx="12" cy="18" r="2.5" fill="#FF5252" stroke="#FF5252"/>
        </svg>
      );

    case 'Generative AI':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" fill="rgba(155, 123, 255, 0.25)" stroke="#9B7BFF"/>
          <path d="M19 3v4M21 5h-4" stroke="#55E6FF"/>
        </svg>
      );

    // ── Data & Analytics ──────────────────────────────────
    case 'Data Analysis':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M3 3v18h18" stroke="currentColor"/>
          <rect x="7" y="10" width="3" height="8" rx="1" fill="#9B7BFF"/>
          <rect x="13" y="6" width="3" height="12" rx="1" fill="#55E6FF"/>
          <path d="m7 9 5-4 4 3 4-4" stroke="#55E6FF" strokeWidth="1.6"/>
        </svg>
      );

    case 'Data Preprocessing':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="#55E6FF" fill="rgba(85, 230, 255, 0.15)"/>
        </svg>
      );

    case 'Feature Engineering':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <line x1="4" y1="21" x2="4" y2="14" stroke="#9B7BFF"/>
          <line x1="4" y1="10" x2="4" y2="3" stroke="#9B7BFF"/>
          <line x1="12" y1="21" x2="12" y2="12" stroke="#55E6FF"/>
          <line x1="12" y1="8" x2="12" y2="3" stroke="#55E6FF"/>
          <line x1="20" y1="21" x2="20" y2="16" stroke="#9B7BFF"/>
          <line x1="20" y1="12" x2="20" y2="3" stroke="#9B7BFF"/>
          <circle cx="4" cy="12" r="2.5" fill="#9B7BFF"/>
          <circle cx="12" cy="10" r="2.5" fill="#55E6FF"/>
          <circle cx="20" cy="14" r="2.5" fill="#9B7BFF"/>
        </svg>
      );

    case 'R Programming':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="8" fill="#276DC3" fillOpacity="0.2" stroke="#276DC3" strokeWidth="1.5"/>
          <path d="M10 8h3.2c1.4 0 2.2.7 2.2 1.8 0 1-.7 1.7-1.8 1.8l2 3.4H13.7l-1.7-3h-1v3H9.5V8H10zm1.5 2.8h1.4c.5 0 .9-.3.9-.7s-.4-.7-.9-.7h-1.4v1.4z" fill="#276DC3"/>
        </svg>
      );

    // ── Embedded Systems ──────────────────────────────────
    case 'Arduino':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M8 8a4 4 0 1 0 0 8c1.6 0 3-1 3.6-2.4h.8C13 15 14.4 16 16 16a4 4 0 1 0 0-8c-1.6 0-3 1-3.6 2.4h-.8C11 9 9.6 8 8 8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="#00979D"/>
          <path d="M6.5 12h3M14.5 12h3M16 10.5v3" stroke="#00979D" strokeWidth="1.2"/>
        </svg>
      );

    case 'Raspberry Pi':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 6.5c-1-1.5-2.8-1.5-3.5 0-1-.3-1.8.8-1.4 1.7-1.2.6-1 2.2.3 2.5-.3.8.3 1.8 1.2 1.8.2 1.2 1.8 1.5 2.5.5.7 1 2.3.7 2.5-.5.9 0 1.5-1 1.2-1.8 1.3-.3 1.5-1.9.3-2.5.4-.9-.4-2-1.4-1.7-.7-1.5-2.5-1.5-3.5 0z" fill="#C51A4A"/>
          <path d="M10.5 4.5c-.8-.8-2-.5-2.2.5.8.5 1.7.2 2.2-.5zM13.5 4.5c.8-.8 2-.5 2.2.5-.8.5-1.7.2-2.2-.5z" fill="#75A927"/>
          <circle cx="10" cy="8.5" r="0.8" fill="#FFFFFF"/>
          <circle cx="14" cy="8.5" r="0.8" fill="#FFFFFF"/>
          <circle cx="12" cy="10.5" r="0.8" fill="#FFFFFF"/>
        </svg>
      );

    case 'Embedded C':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="2" fill="rgba(85, 230, 255, 0.12)" stroke="#55E6FF"/>
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="#55E6FF"/>
          <text x="9.5" y="15" fill="#9B7BFF" fontFamily="sans-serif" fontSize="8" fontWeight="bold">C</text>
        </svg>
      );

    case 'Bluetooth / Wi-Fi Modules':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="m7 7 10 10-5 5V2l5 5L7 17" stroke="#55E6FF"/>
          <path d="M19 5a6 6 0 0 1 0 8.5M21 2a10 10 0 0 1 0 14" stroke="#9B7BFF" strokeWidth="1.4"/>
        </svg>
      );

    // ── Cloud & Tools ─────────────────────────────────────
    case 'AWS':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M7.4 9.5c-.3 0-.7.1-1 .2-.3.1-.5.3-.6.6-.2.3-.2.6-.2.9 0 .4.1.8.4 1 .3.3.7.4 1.2.4.6 0 1.1-.2 1.5-.6.4-.4.6-.9.6-1.5V9.5H7.4zm1.9-2.3v1.3c-.6-.6-1.4-1-2.4-1-1 0-1.8.3-2.3 1-.5.7-.8 1.5-.8 2.6s.3 2 1 2.7c.6.7 1.5 1 2.5 1 1 0 1.8-.4 2.4-1.1v1h1.7V7.2H9.3zm5.4 6.7l-1.5-6.7h1.9l.9 4.6 1-4.6h1.7l1 4.6 1-4.6h1.8l-1.6 6.7h-1.8l-1-4.4-1 4.4h-1.9z" fill="#232F3E"/>
          <path d="M4 17.5c4.5 2.5 11 2.5 15.5 0 .4-.2.8.2.5.6-4.5 3-12 3-16.5 0-.4-.3-.1-.8.5-.6z" fill="#FF9900"/>
          <path d="M19.7 16.8c-.3.4-.9 1-1.5 1.2-.2.1-.3 0-.2-.2.3-.6.7-1.5.7-1.5s.4.1.6.3c.3.1.4.2.4.2z" fill="#FF9900"/>
        </svg>
      );

    case 'Git':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M21.6 10.9L13.1 2.4a1.6 1.6 0 0 0-2.2 0L8.6 4.7l2.8 2.8a1.9 1.9 0 0 1 2.4 2.4l2.7 2.7a1.9 1.9 0 1 1-1.1 1.1l-2.6-2.6v4.6a1.9 1.9 0 1 1-1.6 0v-4.7L8.5 8.2a1.9 1.9 0 1 1-2.4-2.4L2.4 9.5a1.6 1.6 0 0 0 0 2.2l8.5 8.5c.6.6 1.6.6 2.2 0l8.5-8.5a1.6 1.6 0 0 0 0-2.3z" fill="#F05032"/>
        </svg>
      );

    case 'GitHub':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      );

    case 'Microsoft Copilot':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M18 9c0-3.3-2.7-6-6-6S6 5.7 6 9c0 2.2 1.2 4.1 3 5.1v1.4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1.4c1.8-1 3-2.9 3-5.1z" fill="url(#copilotGrad)"/>
          <defs>
            <linearGradient id="copilotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078D4"/>
              <stop offset="50%" stopColor="#8661C5"/>
              <stop offset="100%" stopColor="#FF5D73"/>
            </linearGradient>
          </defs>
          <circle cx="10" cy="8.5" r="1.2" fill="#FFFFFF"/>
          <circle cx="14" cy="8.5" r="1.2" fill="#FFFFFF"/>
        </svg>
      );

    case 'VS Code':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M17.5 2L6.8 10.3 3.2 7.5 2 8.3v7.4l1.2.8 3.6-2.8L17.5 22l4.5-2.2V4.2L17.5 2z" fill="#007ACC"/>
          <path d="M17.5 22V2l4.5 2.2v15.6L17.5 22z" fill="#1F9CF0"/>
          <path d="M17.5 2L6.8 10.3l10.7 7.9V2z" fill="#0065A9"/>
        </svg>
      );

    // ── Frontend & Full-Stack ─────────────────────────────
    case 'React.js':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.3"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" stroke="#61DAFB" strokeWidth="1.3"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" stroke="#61DAFB" strokeWidth="1.3"/>
        </svg>
      );

    case 'HTML5':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 2l1.6 18.2L12 23l7.4-2.8L21 2H3z" fill="#E34F26"/>
          <path d="M12 3.6v17.3l5.8-2.2L19.2 3.6H12z" fill="#EF652A"/>
          <path d="M12 7.7H7.7l.3 3.1h4V7.7zm0 6.2H9.5l-.2-2h-1.5l.4 4.2H12v-2.2zm0 4.1l3.3-1 .4-3.3h-1.5l-.2 1.8-2 .5v2z" fill="#FFFFFF"/>
        </svg>
      );

    case 'CSS3':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 2l1.6 18.2L12 23l7.4-2.8L21 2H3z" fill="#1572B6"/>
          <path d="M12 3.6v17.3l5.8-2.2L19.2 3.6H12z" fill="#33A9DC"/>
          <path d="M12 7.7H7.7l.3 3.1H12V7.7zm0 6.2H9.5l-.2-2h-1.5l.4 4.2H12v-2.2zm0 4.1l3.3-1 .4-3.3h-1.5l-.2 1.8-2 .5v2z" fill="#FFFFFF"/>
        </svg>
      );

    case 'Node.js':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 2l9 5.2v10.4L12 23l-9-5.4V7.2L12 2z" fill="#339933"/>
          <path d="M12 4.1l7.2 4.1v8.4L12 20.8l-7.2-4.2V8.2L12 4.1z" fill="#66CC33"/>
          <path d="M11.5 8v5.5c0 1.2-.7 1.8-1.8 1.8-.8 0-1.4-.4-1.7-1l1.1-.7c.2.4.4.6.6.6.4 0 .6-.2.6-.7V8h1.2z" fill="#FFFFFF"/>
        </svg>
      );

    case 'Three.js':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path d="M12 2L3 19h18L12 2z" stroke="#55E6FF" fill="rgba(85, 230, 255, 0.1)"/>
          <path d="M12 2v17M3 19l9-8M21 19l-9-8" stroke="#9B7BFF" strokeWidth="1.2"/>
        </svg>
      );

    case 'GSAP':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect width="24" height="24" rx="5" fill="#0AE448"/>
          <path d="M17.5 7.5L8.2 13.8l2.8.9-4.5 4.8 9.3-6.3-2.8-.9 4.5-4.8z" fill="#08090D"/>
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="var(--cyan)"/>
        </svg>
      );
  }
}

