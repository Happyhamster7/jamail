'use client';
import { useEffect, useState } from 'react';

export function Thumb({ item, onClick, style, showFrom }) {
  return (
    <button className="thumb" onClick={onClick} style={style} aria-label={item.kind === 'video' ? 'Play video' : 'View photo'}>
      {item.kind === 'video' ? (
        <>
          {/* #t=0.1 makes iOS Safari render the first frame as a poster */}
          <video src={`${item.url}#t=0.1`} muted playsInline preload="metadata" />
          <span className="play"><span>▶</span></span>
        </>
      ) : (
        <img src={item.url} alt="" loading="lazy" />
      )}
      {showFrom && item.from && <span className="from">{item.from.replace(/-/g, ' ')}</span>}
    </button>
  );
}

export function Lightbox({ items, index, onClose }) {
  const [i, setI] = useState(index);
  const [startX, setStartX] = useState(null);
  const item = items[i];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((n) => Math.min(items.length - 1, n + 1));
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [items.length, onClose]);

  // Basic swipe left/right.
  const onTouchEnd = (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) setI((n) => Math.min(items.length - 1, n + 1));
    if (dx > 50) setI((n) => Math.max(0, n - 1));
    setStartX(null);
  };

  if (!item) return null;
  return (
    <div className="overlay dark" onClick={onClose}>
      <div
        className="lightbox"
        onTouchStart={(e) => setStartX(e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <button className="lb-btn lb-close" onClick={onClose} aria-label="Close">✕</button>
        {i > 0 && (
          <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); setI(i - 1); }} aria-label="Previous">‹</button>
        )}
        {i < items.length - 1 && (
          <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); setI(i + 1); }} aria-label="Next">›</button>
        )}
        <div onClick={(e) => e.stopPropagation()}>
          {item.kind === 'video' ? (
            <video key={item.url} src={item.url} controls autoPlay playsInline />
          ) : (
            <img key={item.url} src={item.url} alt="" />
          )}
        </div>
        {items.length > 1 && <div className="lb-count">{i + 1} / {items.length}</div>}
      </div>
    </div>
  );
}
