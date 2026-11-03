const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true };

export const Back = () => (
  <svg {...base}><path d="M15 18l-6-6 6-6" /></svg>
);
export const Close = () => (
  <svg {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Reply = () => (
  <svg {...base}><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 016 6v4" /></svg>
);
export const Smile = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5s1.3 1.8 3.5 1.8 3.5-1.8 3.5-1.8" /><path d="M9 9.5h.01M15 9.5h.01" strokeWidth="3" /></svg>
);
