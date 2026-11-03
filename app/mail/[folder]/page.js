'use client';
import { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { useArchive } from '@/components/ArchiveContext';
import { Lightbox, Thumb } from '@/components/Media';
import Topbar from '@/components/Topbar';
import { folderByKey } from '@/lib/config';

function EyLogo() {
  return (
    <svg viewBox="0 0 120 100" role="img" aria-label="EY logo">
      <polygon points="8,34 112,6 112,22" fill="#ffe600" />
      <text x="8" y="92" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="62" fill="#2e2e38" letterSpacing="-2">
        EY
      </text>
    </svg>
  );
}

export default function Folder() {
  const { folder } = useParams();
  const { data, error } = useArchive();
  const [lb, setLb] = useState(null);
  const closeLb = useCallback(() => setLb(null), []);
  const f = folderByKey(folder);

  if (!f || f.key === 'inbox') {
    return (
      <main className="page">
        <Topbar back="/mail" />
        <p className="empty">This folder doesn&apos;t exist.</p>
      </main>
    );
  }

  const items = data?.folders[f.key] || [];

  return (
    <main className="page">
      <Topbar back="/mail" />
      <h1 className="folder-head">{f.label}</h1>
      <p className="folder-sub">{f.blurb}</p>
      <hr className="rule" />

      {f.key === 'bin' ? (
        <div className="bin-item">
          <EyLogo />
          <p className="bin-note">Items in the Bin will be permanently deleted. Good riddance.</p>
        </div>
      ) : (
        <>
          {error && <p className="empty">Couldn&apos;t load: {error}</p>}
          {!data && !error && <div className="spinner" />}
          {data && items.length === 0 && (
            <div className="empty">
              <div className="big">{f.icon}</div>
              <p>Nothing here yet.</p>
            </div>
          )}
          {items.length > 0 && (
            <div className="media-grid">
              {items.map((it, i) => (
                <Thumb
                  key={it.url}
                  item={it}
                  showFrom
                  onClick={() => setLb(i)}
                  style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {lb != null && <Lightbox items={items} index={lb} onClose={closeLb} />}
    </main>
  );
}
