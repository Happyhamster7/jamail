'use client';
import { useState } from 'react';

// Jam Jam, peeking in from the bottom-right corner and swaying side to side.
// Tap her for a meow.
export default function Cat() {
  const [taps, setTaps] = useState(0);
  return (
    <button className="cat-wrap" aria-label="Jam Jam the cat" onClick={() => setTaps((t) => t + 1)}>
      <div key={taps} className={`meow ${taps ? 'tapped' : ''}`}>meow</div>
      <svg viewBox="0 0 260 250" aria-hidden="true">
        <path
          d="M28 252 C 22 205 28 172 46 150 C 30 128 30 104 44 86 L 40 26 L 88 60 Q 122 50 156 60 L 194 22 L 196 86 C 212 104 216 128 206 148 C 232 158 252 176 262 200 L 262 252 Z"
          fill="#fffaf5"
          stroke="#2b2024"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M50 42 L56 74 L76 62 Z" fill="#f6b8c3" />
        <path d="M184 40 L184 74 L166 62 Z" fill="#f6b8c3" />
        <g stroke="#2b2024" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M82 112 Q 92 118 102 112" />
          <path d="M136 110 Q 146 116 156 110" />
          <path d="M106 138 Q 119 150 132 136" />
        </g>
        <path d="M114 126 L124 126 L119 132 Z" fill="#c8324b" />
        <ellipse cx="74" cy="132" rx="11" ry="7" fill="#f6b8c3" opacity="0.7" />
        <ellipse cx="166" cy="130" rx="11" ry="7" fill="#f6b8c3" opacity="0.7" />
        <g stroke="#2b2024" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <path d="M60 124 L28 118" />
          <path d="M60 134 L30 138" />
          <path d="M180 122 L212 116" />
          <path d="M180 132 L210 136" />
        </g>
      </svg>
    </button>
  );
}
