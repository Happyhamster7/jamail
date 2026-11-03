'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Thumb } from '@/components/Media';
import { UPLOAD_FOLDERS, folderByKey, kindOf, slugify } from '@/lib/config';
import { uploadFile } from '@/lib/upload-client';

const PW_KEY = 'jamail-submit-pw';
const NAME_KEY = 'jamail-submit-name';

let uid = 0;
const toPending = (file) => ({
  id: ++uid,
  file,
  preview: URL.createObjectURL(file),
  kind: file.type.startsWith('video') ? 'video' : kindOf(file.name),
  progress: 0,
});
const fromSaved = (a) => ({ id: ++uid, url: a.url, preview: a.url, kind: a.kind, progress: 100 });

function store(key, val) {
  try {
    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  } catch {}
}
function load(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function PendingGrid({ items, onRemove }) {
  if (!items.length) return null;
  return (
    <div className="pending-grid">
      {items.map((a) => (
        <div key={a.id} className="pending">
          <Thumb item={{ url: a.preview, kind: a.kind }} />
          {!a.url && a.progress > 0 && (
            <div className="bar"><i style={{ width: `${a.progress}%` }} /></div>
          )}
          <button className="x" onClick={() => onRemove(a.id)} aria-label="Remove">✕</button>
        </div>
      ))}
    </div>
  );
}

export default function Submit() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [gateErr, setGateErr] = useState('');
  const [data, setData] = useState(null);

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const slug = slugify(`${first} ${last}`);

  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [atts, setAtts] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const [msgState, setMsgState] = useState({});

  const [folder, setFolder] = useState('spam');
  const [drops, setDrops] = useState([]);
  const [dropState, setDropState] = useState({});

  const fetchData = useCallback(async (password) => {
    const res = await fetch('/api/archive', { headers: { 'x-password': password }, cache: 'no-store' });
    if (res.status === 401) throw new Error('Wrong password');
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || 'Could not load');
    setData(j);
    return j;
  }, []);

  useEffect(() => {
    const saved = load(PW_KEY);
    if (saved) {
      setPw(saved);
      fetchData(saved).then(() => setAuthed(true)).catch(() => {});
    }
    try {
      const n = JSON.parse(load(NAME_KEY) || '{}');
      if (n.first) setFirst(n.first);
      if (n.last) setLast(n.last);
    } catch {}
  }, [fetchData]);

  useEffect(() => {
    if (first || last) store(NAME_KEY, { first, last });
  }, [first, last]);

  // If this person already sent a message, load it so they can edit it.
  useEffect(() => {
    if (!data || !slug || slug === loadedSlug) return;
    const m = data.messages.find((x) => x.slug === slug);
    if (!m) return;
    setEmail(m.email || '');
    setBody(m.body || '');
    setAvatar(m.avatarUrl ? { url: m.avatarUrl, preview: m.avatarUrl } : null);
    setAtts((m.attachments || []).map(fromSaved));
    setCreatedAt(m.createdAt);
    setLoadedSlug(slug);
  }, [data, slug, loadedSlug]);

  const unlock = async (e) => {
    e.preventDefault();
    setGateErr('');
    try {
      await fetchData(pw);
      store(PW_KEY, pw);
      setAuthed(true);
    } catch (err) {
      setGateErr(err.message);
    }
  };

  const sendMessage = async () => {
    if (!first.trim()) return setMsgState({ err: 'Add your name at the top first.' });
    if (!body.trim()) return setMsgState({ err: 'Write Shiv a message first!' });
    setMsgState({ busy: true });
    try {
      const dir = `uploads/messages/${slug}`;
      let avatarUrl = avatar?.url || '';
      if (avatar?.file) {
        avatarUrl = await uploadFile(avatar.file, dir, pw);
        setAvatar({ url: avatarUrl, preview: avatar.preview });
      }
      const done = [];
      for (const a of atts) {
        if (a.url) {
          done.push(a);
          continue;
        }
        const url = await uploadFile(a.file, dir, pw, (p) =>
          setAtts((list) => list.map((x) => (x.id === a.id ? { ...x, progress: Math.max(1, p) } : x)))
        );
        const updated = { ...a, url, progress: 100 };
        setAtts((list) => list.map((x) => (x.id === a.id ? updated : x)));
        done.push(updated);
      }
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-password': pw },
        body: JSON.stringify({
          firstName: first,
          lastName: last,
          email,
          body,
          avatarUrl,
          attachments: done.map((a) => ({ url: a.url, kind: a.kind })),
          createdAt,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Could not save');
      setCreatedAt(j.message.createdAt);
      setEmail(j.message.email);
      setLoadedSlug(slug);
      setMsgState({ ok: 'Sent! 💌 It’s in Shiv’s Inbox. You can come back and edit it any time.' });
      fetchData(pw).catch(() => {});
    } catch (e) {
      setMsgState({ err: `${e.message || 'Upload failed'} — press Send again to retry.` });
    }
  };

  const uploadDrops = async () => {
    if (!first.trim()) return setDropState({ err: 'Add your name at the top first.' });
    if (!drops.length) return;
    setDropState({ busy: true });
    let failed = 0;
    for (const d of drops) {
      if (d.url) continue;
      try {
        const url = await uploadFile(
          d.file,
          `uploads/folders/${folder}`,
          pw,
          (p) => setDrops((list) => list.map((x) => (x.id === d.id ? { ...x, progress: Math.max(1, p) } : x))),
          `${slug}__`
        );
        setDrops((list) => list.map((x) => (x.id === d.id ? { ...x, url, progress: 100 } : x)));
      } catch {
        failed++;
      }
    }
    if (failed) {
      setDrops((list) => list.filter((x) => !x.url));
      setDropState({ err: `${failed} file(s) failed — press Upload again to retry them.` });
    } else {
      setDrops([]);
      setDropState({ ok: `Uploaded to ${folderByKey(folder).label} ✓` });
    }
    fetchData(pw).catch(() => {});
  };

  const remove = async (url, what) => {
    if (!window.confirm(`Delete this ${what}? This can't be undone.`)) return;
    await fetch('/api/archive', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', 'x-password': pw },
      body: JSON.stringify({ url }),
    });
    if (what === 'message') {
      setLoadedSlug(null);
      setCreatedAt(null);
    }
    fetchData(pw).catch(() => {});
  };

  const onBodyFocus = () => {
    if (!body) setBody(`Hi Shiv,\n\nI hope you're well...\n\n\n\nThanks!\n\nKind Regards\n${first || ''}`);
  };

  if (!authed) {
    return (
      <main className="page">
        <h1 className="brand" style={{ fontSize: 52 }}>JA<span className="jam">M</span>ail</h1>
        <p className="tagline">Friends only 🤫</p>
        <form className="card stack" onSubmit={unlock}>
          <div>
            <label className="field-label" htmlFor="pw">Secret password</label>
            <input id="pw" className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
            <p className="err">{gateErr}</p>
          </div>
          <button className="btn block" disabled={!pw}>Let me in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="page submit-page">
      <h1 className="brand" style={{ fontSize: 52 }}>JA<span className="jam">M</span>ail</h1>
      <p className="tagline">Help fill Shiv&apos;s inbox for her 25th 🎂</p>

      <section className="card stack">
        <h2>Who are you?</h2>
        <div className="row2">
          <div>
            <label className="field-label" htmlFor="first">First name</label>
            <input id="first" className="input" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Fiona" />
          </div>
          <div>
            <label className="field-label" htmlFor="last">Last name</label>
            <input id="last" className="input" value={last} onChange={(e) => setLast(e.target.value)} placeholder="Wu" />
          </div>
        </div>
        {loadedSlug === slug && slug && <p className="ok">Found your message, so you&apos;re editing it below.</p>}
      </section>

      <section className="card stack">
        <div>
          <h2>Your message → Inbox</h2>
          <p className="hint">Shiv gets an envelope with your name on it. Write it like a (very formal) email.</p>
        </div>
        <div className="avatar-pick">
          {avatar ? (
            <img className="avatar" src={avatar.preview} alt="" />
          ) : (
            <div className="avatar">{first ? first[0].toUpperCase() : '?'}</div>
          )}
          <label className="btn ghost small">
            {avatar ? 'Change profile pic' : 'Add profile pic'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setAvatar({ file: f, preview: URL.createObjectURL(f) });
                e.target.value = '';
              }}
            />
          </label>
        </div>
        <div>
          <label className="field-label" htmlFor="email">Your email (shown under your name)</label>
          <input
            id="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`${slugify(first) || 'fiona'}.${slugify(last) || 'wu'}@jamail.com`}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="body">Message</label>
          <textarea id="body" className="textarea" value={body} onFocus={onBodyFocus} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Attachments (pics &amp; videos)</label>
          <label className="file-pick">
            ＋ Add photos / videos
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAtts((a) => [...a, ...files.map(toPending)]);
                e.target.value = '';
              }}
            />
          </label>
        </div>
        <PendingGrid items={atts} onRemove={(id) => setAtts((a) => a.filter((x) => x.id !== id))} />
        <button className="btn block" onClick={sendMessage} disabled={msgState.busy}>
          {msgState.busy ? 'Sending… keep this page open' : loadedSlug === slug && slug ? 'Update message' : 'Send to Shiv'}
        </button>
        {msgState.err && <p className="err">{msgState.err}</p>}
        {msgState.ok && <p className="ok">{msgState.ok}</p>}
      </section>

      <section className="card stack">
        <div>
          <h2>Drop pics into a folder</h2>
          <p className="hint">Spam = random pics · Top Secret = embarrassing pics/vids of Shiv · Blackmail = embarrassing vids of us</p>
        </div>
        <div className="chips">
          {UPLOAD_FOLDERS.map((k) => (
            <button key={k} className={`chip ${folder === k ? 'on' : ''}`} onClick={() => setFolder(k)}>
              {folderByKey(k).icon} {folderByKey(k).label}
            </button>
          ))}
        </div>
        <label className="file-pick">
          ＋ Choose photos / videos
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setDrops((d) => [...d, ...files.map(toPending)]);
              setDropState({});
              e.target.value = '';
            }}
          />
        </label>
        <PendingGrid items={drops} onRemove={(id) => setDrops((d) => d.filter((x) => x.id !== id))} />
        <button className="btn block" onClick={uploadDrops} disabled={dropState.busy || !drops.length}>
          {dropState.busy ? 'Uploading… keep this page open' : `Upload to ${folderByKey(folder).label}`}
        </button>
        {dropState.err && <p className="err">{dropState.err}</p>}
        {dropState.ok && <p className="ok">{dropState.ok}</p>}
      </section>

      <section className="card">
        <h2>Everything so far</h2>
        <p className="hint">Anything here can be deleted by any friend, so be nice.</p>
        {!data ? (
          <div className="spinner" />
        ) : (
          <>
            <div className="manage-folder">
              <h3>✉️ Inbox ({data.messages.length})</h3>
              {data.messages.map((m) => (
                <div key={m.slug} className="msg-list-item">
                  {m.avatarUrl ? <img className="avatar" src={m.avatarUrl} alt="" /> : <div className="avatar">{m.firstName[0]}</div>}
                  <div className="grow">
                    {m.firstName} {m.lastName}
                    <small>{m.attachments?.length || 0} attachment(s)</small>
                  </div>
                  <button className="btn ghost small" onClick={() => remove(m.jsonUrl, 'message')}>Delete</button>
                </div>
              ))}
            </div>
            {UPLOAD_FOLDERS.map((k) => (
              <div key={k} className="manage-folder">
                <h3>{folderByKey(k).icon} {folderByKey(k).label} ({data.folders[k].length})</h3>
                <div className="pending-grid">
                  {data.folders[k].map((it) => (
                    <div key={it.url} className="pending">
                      <Thumb item={it} showFrom />
                      <button className="x" onClick={() => remove(it.url, 'file')} aria-label="Delete">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      <p style={{ textAlign: 'center', marginTop: 28 }}>
        <Link href="/" className="link-btn">Preview what Shiv sees →</Link>
      </p>
    </main>
  );
}
