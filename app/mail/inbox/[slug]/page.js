'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useArchive } from '@/components/ArchiveContext';
import { Lightbox, Thumb } from '@/components/Media';
import { Close, Reply, Smile } from '@/components/Icons';
import Topbar from '@/components/Topbar';

const EMOJIS = ['❤️', '😂', '😭', '🥹', '🎉', '🐱'];

export default function Message() {
  const { slug } = useParams();
  const router = useRouter();
  const { data, error, markRead } = useArchive();
  const [tray, setTray] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [lb, setLb] = useState(null);
  const closeLb = useCallback(() => setLb(null), []);

  const m = data?.messages.find((x) => x.slug === slug);

  useEffect(() => {
    if (m) markRead(m.slug);
  }, [m, markRead]);

  const react = (emoji, e) => {
    setTray(false);
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    const parts = Array.from({ length: 16 }, (_, k) => ({
      key: `${id}-${k}`,
      emoji,
      left: r.left + r.width / 2 - 17 + (Math.random() - 0.5) * 60,
      top: r.top + (Math.random() - 0.5) * 20,
      dx: `${(Math.random() - 0.5) * 220}px`,
      rot: `${(Math.random() - 0.5) * 120}deg`,
      delay: `${Math.random() * 350}ms`,
    }));
    setBursts((b) => [...b, ...parts]);
    setTimeout(() => setBursts((b) => b.filter((p) => !p.key.startsWith(`${id}-`))), 2400);
  };

  if (!data) {
    return (
      <main className="page">
        {error ? <p className="empty">Couldn&apos;t load mail: {error}</p> : <div className="spinner" />}
      </main>
    );
  }
  if (!m) {
    return (
      <main className="page">
        <Topbar back="/mail/inbox" title="Inbox" />
        <p className="empty">This message seems to have been eaten by Jam Jam.</p>
      </main>
    );
  }

  const fullName = [m.firstName, m.lastName].filter(Boolean).join(' ');

  return (
    <main className="page">
      <div className="topbar">
        <span style={{ flex: 1 }} />
        <div className="msg-actions">
          <button className="icon-btn" aria-label="React" onClick={() => setTray((t) => !t)}><Smile /></button>
          <button className="icon-btn" aria-label="Reply" onClick={() => setBounce(true)}><Reply /></button>
          <button className="icon-btn" aria-label="Close" onClick={() => router.push('/mail/inbox')}><Close /></button>
          {tray && (
            <div className="emoji-tray">
              {EMOJIS.map((e) => (
                <button key={e} onClick={(ev) => react(e, ev)} aria-label={`React ${e}`}>{e}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="msg-head">
        {m.avatarUrl ? (
          <img className="avatar" src={m.avatarUrl} alt="" />
        ) : (
          <div className="avatar">{m.firstName[0]}</div>
        )}
        <div style={{ minWidth: 0 }}>
          <div className="msg-from">{fullName}</div>
          <div className="msg-meta">
            <b>{m.email}</b>
            <br />
            to me · 25:00 am
          </div>
        </div>
      </div>

      {m.attachments?.length > 0 && (
        <div className="attach-row">
          {m.attachments.map((a, i) => (
            <Thumb key={a.url} item={a} onClick={() => setLb(i)} />
          ))}
        </div>
      )}

      <div className="msg-body">{m.body}</div>

      {bursts.map((p) => (
        <span
          key={p.key}
          className="burst"
          style={{ left: p.left, top: p.top, '--dx': p.dx, '--rot': p.rot, animationDelay: p.delay }}
        >
          {p.emoji}
        </span>
      ))}

      {bounce && (
        <div className="overlay" onClick={() => setBounce(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="bounce-ico">⚠️</div>
            <h3>Message not delivered</h3>
            <p>Error — this recipient is too busy eating the world and cannot be reached.</p>
            <div className="code">550 5.1.1 &lt;{m.email}&gt;: recipient is currently eating the world</div>
            <button className="btn block" onClick={() => setBounce(false)}>OK fine</button>
          </div>
        </div>
      )}

      {lb != null && <Lightbox items={m.attachments} index={lb} onClose={closeLb} />}
    </main>
  );
}
