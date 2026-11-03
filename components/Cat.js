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
        <defs>
          <clipPath id="jj-head">
            <path d="M28 252 C 22 205 28 172 46 150 C 30 128 30 104 44 86 L 40 26 L 88 60 Q 122 50 156 60 L 194 22 L 196 86 C 212 104 216 128 206 148 C 232 158 252 176 262 200 L 262 252 Z" />
          </clipPath>
        </defs>
        {/* grey tabby coat */}
        <path
          d="M28 252 C 22 205 28 172 46 150 C 30 128 30 104 44 86 L 40 26 L 88 60 Q 122 50 156 60 L 194 22 L 196 86 C 212 104 216 128 206 148 C 232 158 252 176 262 200 L 262 252 Z"
          fill="#a3a2a6"
        />
        <g clipPath="url(#jj-head)" fill="none" stroke="#5d5b62" strokeWidth="7" strokeLinecap="round">
          {/* the classic tabby "M" on the forehead */}
          <path d="M100 92 L 106 70 L 119 86 L 132 68 L 138 92" />
          <path d="M119 62 L 119 76" strokeWidth="5" />
          {/* cheek stripes */}
          <path d="M40 112 Q 56 110 66 118" strokeWidth="6" />
          <path d="M36 128 Q 52 126 62 132" strokeWidth="6" />
          <path d="M200 110 Q 184 108 174 116" strokeWidth="6" />
          <path d="M204 126 Q 188 124 178 130" strokeWidth="6" />
          {/* shoulder and back stripes */}
          <path d="M40 176 Q 56 188 52 206" />
          <path d="M32 204 Q 48 214 44 236" />
          <path d="M214 160 Q 206 176 214 192" />
          <path d="M236 172 Q 226 188 234 206" />
          <path d="M252 194 Q 244 210 252 228" />
        </g>
        {/* pale muzzle and chin */}
        <ellipse cx="119" cy="136" rx="30" ry="20" fill="#dcdbe0" />
        <path
          d="M28 252 C 22 205 28 172 46 150 C 30 128 30 104 44 86 L 40 26 L 88 60 Q 122 50 156 60 L 194 22 L 196 86 C 212 104 216 128 206 148 C 232 158 252 176 262 200 L 262 252 Z"
          fill="none"
          stroke="#2b2024"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M50 42 L56 74 L76 62 Z" fill="#f2b6c0" />
        <path d="M184 40 L184 74 L166 62 Z" fill="#f2b6c0" />
        <g stroke="#2b2024" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M82 112 Q 92 118 102 112" />
          <path d="M136 110 Q 146 116 156 110" />
          <path d="M106 138 Q 119 150 132 136" />
        </g>
        <path d="M114 126 L124 126 L119 132 Z" fill="#d98a96" stroke="#2b2024" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="74" cy="132" rx="10" ry="6" fill="#f2b6c0" opacity="0.6" />
        <ellipse cx="166" cy="130" rx="10" ry="6" fill="#f2b6c0" opacity="0.6" />
        <g stroke="#f4f3f6" strokeWidth="2" strokeLinecap="round" opacity="0.9">
          <path d="M92 134 L58 126" />
          <path d="M92 142 L60 146" />
          <path d="M146 132 L180 124" />
          <path d="M146 140 L178 144" />
        </g>
      </svg>
    </button>
  );
}
