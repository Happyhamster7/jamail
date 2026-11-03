'use client';
import { useState } from 'react';

// Cut-out photos of the real Jam Jam (public/jamjam/*.webp, transparent).
// splash and login are cut off along the bottom (and login's left side),
// so those edges are tucked against the screen edge; flip mirrors login so
// its cut side faces the right edge.
const PHOTOS = {
  splash: { src: '/jamjam/splash.webp', width: 160 },
  login: { src: '/jamjam/login.webp', width: 150, flip: true },
  dashboard: { src: '/jamjam/dashboard.webp', width: 120, lift: 12, inset: 14 },
};

// Jam Jam peeking in from the bottom-right corner, swaying side to side.
// Tap her for a meow.
export default function Cat({ photo = 'splash' }) {
  const [taps, setTaps] = useState(0);
  const p = PHOTOS[photo] || PHOTOS.splash;
  return (
    <button
      className="cat-wrap"
      aria-label="Jam Jam the cat"
      style={{ width: p.width, marginBottom: p.lift || 0, right: p.inset || 0 }}
      onClick={() => setTaps((t) => t + 1)}
    >
      <div key={taps} className={`meow ${taps ? 'tapped' : ''}`}>meow</div>
      <img className={`cat-photo ${p.flip ? 'flip' : ''}`} src={p.src} alt="" draggable={false} />
    </button>
  );
}
