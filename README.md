# Sayani Ghosal — Cinematic Portfolio (Next.js)

Next.js App Router · React · Three.js · GSAP · CSS Modules

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things are

| Path | What it does |
| --- | --- |
| `components/VideoIntro/` | Sticky hero: video + blurred ambient copy, grading, GSAP entrance, controls, scroll cue |
| `components/CinematicLayer/` | Three.js bokeh/ember particle layer (GPU-driven, disposes cleanly) |
| `components/Sections/` | About / Skills / Projects / Journey / Contact, sliding over the hero |
| `data/portfolio.js` | **All your text.** Add `email`, `github`, `linkedin` and project links here |
| `public/videos/` | `intro.mp4` + `intro-poster.jpg`. Replace to change the video |
| `lib/scrollToId.js` | Shared GSAP smooth-scroll |

## Tuning

- Particle count / colours / speed: top of `CinematicLayer.jsx` (`count`, `PALETTE`, `rise` in the shader).
- Entrance pacing: the timeline in `VideoIntro.jsx` (times are in seconds).
- Where the person sits relative to the text: `.fgWrap` width in `VideoIntro.module.css`.
