'use client';
import Link from 'next/link';
import Envelope from '@/components/Envelope';
import Topbar from '@/components/Topbar';
import { useArchive } from '@/components/ArchiveContext';

export default function Inbox() {
  const { data, error, read, markAllUnread } = useArchive();

  return (
    <main className="page">
      <Topbar back="/mail" title="Inbox" />
      {error && <p className="empty">Couldn&apos;t load mail: {error}</p>}
      {!data && !error && <div className="spinner" />}
      {data && data.messages.length === 0 && (
        <div className="empty">
          <div className="big">📭</div>
          <p>No mail yet… Jam Jam is waiting by the door.</p>
        </div>
      )}
      {data && data.messages.length > 0 && (
        <>
          <h1 className="section-title">
            You&apos;ve received {data.messages.length === 1 ? 'a message' : `${data.messages.length} messages`}
          </h1>
          <div className="env-grid">
            {data.messages.map((m, i) => {
              const isRead = read.includes(m.slug);
              return (
                <Link
                  key={m.slug}
                  href={`/mail/inbox/${m.slug}`}
                  className={`env-tile ${isRead ? 'read' : ''}`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <Envelope open={isRead} seal={!isRead} />
                  <div className="who">{m.firstName}</div>
                </Link>
              );
            })}
          </div>
          {data.messages.some((m) => read.includes(m.slug)) && (
            <button className="btn ghost block mark-unread" onClick={markAllUnread}>
              ✉️ Mark all as unread
            </button>
          )}
        </>
      )}
    </main>
  );
}
