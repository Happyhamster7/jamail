// Server-only helpers for reading the archive out of Vercel Blob.
import { list } from '@vercel/blob';
import { UPLOAD_FOLDERS, kindOf } from './config';

async function listAll(prefix) {
  const out = [];
  let cursor;
  do {
    const res = await list({ prefix, cursor, limit: 1000 });
    out.push(...res.blobs);
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return out;
}

const isJamJam = (m) => (m.slug === 'jam-jam' || m.slug === 'jamjam' ? 1 : 0);

export async function loadArchive() {
  const [msgBlobs, folderBlobs] = await Promise.all([
    listAll('data/messages/'),
    listAll('uploads/folders/'),
  ]);

  const messages = (
    await Promise.all(
      msgBlobs
        .filter((b) => b.pathname.endsWith('.json'))
        .map(async (b) => {
          try {
            // uploadedAt changes on every overwrite, so this busts the CDN cache.
            const v = new Date(b.uploadedAt).getTime();
            const res = await fetch(`${b.url}?v=${v}`, { cache: 'no-store' });
            return { ...(await res.json()), jsonUrl: b.url };
          } catch {
            return null;
          }
        })
    )
  )
    .filter(Boolean)
    // Jam Jam's letter always comes last, as the finale.
    .sort((a, b) => isJamJam(a) - isJamJam(b) || String(a.createdAt).localeCompare(String(b.createdAt)));

  const folders = Object.fromEntries(UPLOAD_FOLDERS.map((f) => [f, []]));
  for (const b of folderBlobs) {
    // uploads/folders/<folder>/<from-slug>__<filename>
    const [, , folder, file = ''] = b.pathname.split('/');
    if (!folders[folder]) continue;
    const from = file.includes('__') ? file.split('__')[0] : '';
    folders[folder].push({
      url: b.url,
      from,
      kind: kindOf(file),
      uploadedAt: b.uploadedAt,
    });
  }
  for (const items of Object.values(folders)) {
    items.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
  }

  return { messages, folders };
}
