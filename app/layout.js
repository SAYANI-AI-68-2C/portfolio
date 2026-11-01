import { Syne, Manrope } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../lib/ThemeContext';

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://portfolio-sayani-ghosal.vercel.app'),
  title: 'Sayani Ghosal — AI/ML · Data Analyst · Software Engineer',
  description:
    'Portfolio of Sayani Ghosal: B.Tech CSE (AI) student at UEM Kolkata. ML Engineer, Data Analyst & Full-Stack Developer with hands-on experience in TensorFlow, OpenCV, AWS, and embedded systems.',
  openGraph: {
    title: 'Sayani Ghosal — AI/ML · Data Analyst · Software Engineer',
    description: 'ML Engineer, Data Analyst & Software Engineer — Kolkata, India.',
    url: 'https://portfolio-sayani-ghosal.vercel.app',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#08090D',
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable}`} data-theme="dark">
      <body>
        {/* Scroll progress bar */}
        <div id="sg-progress" aria-hidden="true" />
        {/* Custom cursor dot */}
        <div id="sg-cursor" aria-hidden="true" />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {/* Scroll progress + cursor script */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var prog = document.getElementById('sg-progress');
            var cur  = document.getElementById('sg-cursor');
            window.addEventListener('scroll', function() {
              var max = document.documentElement.scrollHeight - window.innerHeight;
              if (prog && max > 0) prog.style.transform = 'scaleX(' + (window.scrollY / max) + ')';
            }, { passive: true });
            if (cur) {
              window.addEventListener('pointermove', function(e) {
                cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
                var card = e.target && e.target.closest && e.target.closest('[data-card]');
                if (card) { cur.classList.add('big'); cur.textContent = 'EXPLORE'; }
                else { cur.classList.remove('big'); cur.textContent = ''; }
              }, { passive: true });
            }
          })();
        ` }} />
      </body>
    </html>
  );
}
