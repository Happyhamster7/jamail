// Hand-drawn-ish envelope. `open` flips the flap up and slides a letter out.
export default function Envelope({ open = false, badge, badgeSmall = false, seal = false, className = '' }) {
  return (
    <div className={`env ${open ? 'open' : ''} ${className}`}>
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <g className="letter">
          <rect x="22" y="14" width="156" height="110" rx="6" fill="#fff" stroke="#2b2024" strokeWidth="2" />
          <path d="M40 40 H140 M40 56 H160 M40 72 H120" stroke="#ecdfd8" strokeWidth="5" strokeLinecap="round" />
        </g>
        <rect x="4" y="6" width="192" height="130" rx="14" fill="#fffdfb" stroke="#2b2024" strokeWidth="3.5" />
        <path d="M8 130 L84 74 M192 130 L116 74" stroke="#2b2024" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
        <path
          className="flap"
          d="M7 12 Q 8 8 14 10 L 94 78 Q 100 83 106 78 L 186 10 Q 192 8 193 12"
          fill="#fbefe7"
          stroke="#2b2024"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      {seal && <span className="env-seal">♥</span>}
      {badge != null && <span className={`env-badge ${badgeSmall ? 'small' : ''}`}>{badge}</span>}
    </div>
  );
}
