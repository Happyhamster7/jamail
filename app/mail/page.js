'use client';
import Link from 'next/link';
import Cat from '@/components/Cat';
import Topbar from '@/components/Topbar';
import { useArchive } from '@/components/ArchiveContext';
import { FOLDERS } from '@/lib/config';

export default function Folders() {
  const { data, read } = useArchive();

  const countFor = (key) => {
    if (!data) return null;
    if (key === 'inbox') {
      const unread = data.messages.filter((m) => !read.includes(m.slug)).length;
      return unread ? { n: unread, hot: true } : null;
    }
    if (key === 'bin') return { n: 1 };
    const n = data.folders[key]?.length;
    return n ? { n } : null;
  };

  return (
    <main className="page with-cat">
      <Topbar />
      <h1 className="hello">Hi Shivani 👋</h1>
      <p className="hello-sub">Happy 25th birthday! You have mail.</p>
      <ul className="folder-list">
        {FOLDERS.map((f, i) => {
          const c = countFor(f.key);
          return (
            <li key={f.key}>
              <Link
                href={f.key === 'inbox' ? '/mail/inbox' : `/mail/${f.key}`}
                className="folder-row"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="ico">{f.icon}</span>
                <span>
                  <div className="name">{f.label}</div>
                  <div className="blurb">{f.blurb}</div>
                </span>
                <span className="end">
                  {c && <span className={`count ${c.hot ? '' : 'muted'}`}>{c.n}</span>}
                  <span className="chev">›</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Cat photo="dashboard" />
    </main>
  );
}
