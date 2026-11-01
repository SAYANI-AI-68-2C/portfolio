'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header/Header';
import VideoIntro from '../components/VideoIntro/VideoIntro';
import Sections from '../components/Sections/Sections';
import BackToTop from '../components/BackToTop/BackToTop';
import { profile } from '../data/portfolio';
import { useScrollReveal } from '../lib/useScrollReveal';

const Loader = dynamic(() => import('../components/Loader/Loader'), { ssr: false });
const BackgroundGlobe = dynamic(() => import('../components/BackgroundGlobe/BackgroundGlobe'), { ssr: false });

function PageContent() {
  useScrollReveal();

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Header />
      <VideoIntro
        src={profile.video}
        poster={profile.poster}
        nextId="about"
        tagline={profile.tagline}
        firstName={profile.firstName}
        lastName={profile.lastName}
        role={profile.role}
        description={profile.description}
      />
      <Sections />
      <BackToTop />
    </main>
  );
}

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Global 3-D background globe — behind everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <BackgroundGlobe />
      </div>

      {/* Main portfolio content mounted immediately */}
      <PageContent />

      {/* Loader splash — overlay on top, removed after animation */}
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
    </>
  );
}
