'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Envelope from '@/components/Envelope';
import Cat from '@/components/Cat';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState(null); // 'qr' on desktop, 'splash' on phones
  const [url, setUrl] = useState('');
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    setUrl(window.location.origin);
    const desktop = window.matchMedia('(min-width: 820px) and (hover: hover) and (pointer: fine)').matches;
    setMode(desktop ? 'qr' : 'splash');
    router.prefetch('/login');
  }, [router]);

  const open = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => router.push('/login'), 800);
  };

  if (!mode) return null;

  if (mode === 'qr') {
    return (
      <main className="qr-page">
        <div>
          <div className="qr-card">
            <QRCodeSVG value={url} size={240} fgColor="#2b2024" bgColor="transparent" marginSize={0} />
            <p className="qr-title">Scan me on your phone</p>
            <p className="qr-sub">You&apos;ve got mail.</p>
            <div className="qr-arrow">↓</div>
          </div>
          <button className="link-btn" onClick={() => setMode('splash')}>or open it here instead</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page with-cat">
      <h1 className="brand">JA<span className="jam">M</span>ail</h1>
      <p className="tagline">You have 5 new messages</p>
      <button
        onClick={open}
        aria-label="Open your mail"
        style={{ display: 'block', margin: '24px auto 0', background: 'none', border: 'none', padding: 0 }}
      >
        <Envelope open={opening} badge={5} className={`splash-env ${opening ? '' : 'wiggle'}`} />
      </button>
      <p className="tap-hint">tap to open</p>
      <Cat />
    </main>
  );
}
