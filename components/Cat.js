'use client';
import { useState } from 'react';

// Photos of the real Jam Jam (public/jamjam/*.jpg, all 3:4 portraits).
// size/pos crop each one into the square frame via background-size/position.
const PHOTOS = {
  splash: { src: '/jamjam/splash.jpg', size: '112%', pos: '50% 42%' },
  login: { src: '/jamjam/login.jpg', size: '167%', pos: '63% 0%' },
  dashboard: { src: '/jamjam/dashboard.jpg', size: '136%', pos: '38% 13%' },
};

// Jam Jam in a little photo frame in the bottom-right corner, swaying
// side to side. Tap her for a meow.
export default function Cat({ photo = 'splash' }) {
  const [taps, setTaps] = useState(0);
  const p = PHOTOS[photo] || PHOTOS.splash;
  return (
    <button className="cat-wrap" aria-label="Jam Jam the cat" onClick={() => setTaps((t) => t + 1)}>
      <div key={taps} className={`meow ${taps ? 'tapped' : ''}`}>meow</div>
      <div
        className="cat-photo"
        role="img"
        aria-label="Jam Jam"
        style={{ backgroundImage: `url(${p.src})`, backgroundSize: p.size, backgroundPosition: p.pos }}
      />
    </button>
  );
}
