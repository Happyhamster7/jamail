// Shared, client-safe configuration.

export const VIEW_PIN = '2410';
export const SHIV_EMAIL = 'shivani.prasad@jamail.com';
export const DEFAULT_TIME = '25:00 am';
export const DEFAULT_BOUNCE = 'Error — this recipient is too busy eating the world and cannot be reached.';

export const FOLDERS = [
  { key: 'inbox', label: 'Inbox', icon: '✉️', blurb: 'Messages' },
  { key: 'spam', label: 'Spam', icon: '🥫', blurb: 'Unsolicited pics' },
  { key: 'top-secret', label: 'Top Secret', icon: '🕵️', blurb: 'Classified. Do not open.' },
  { key: 'blackmail', label: 'Blackmail', icon: '📼', blurb: 'Evidence (against us)' },
  { key: 'bin', label: 'Bin', icon: '🗑️', blurb: '1 item' },
];

// Folders friends can upload loose pics/videos into.
export const UPLOAD_FOLDERS = ['spam', 'top-secret', 'blackmail'];

export function folderByKey(key) {
  return FOLDERS.find((f) => f.key === key);
}

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function safeFileName(name) {
  return String(name || 'file').replace(/[^\w.-]+/g, '-').slice(-80);
}

const VIDEO_EXT = ['mp4', 'mov', 'm4v', 'webm', 'ogv', '3gp'];
const MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  heic: 'image/heic', heif: 'image/heif', avif: 'image/avif',
  mp4: 'video/mp4', mov: 'video/quicktime', m4v: 'video/x-m4v', webm: 'video/webm', ogv: 'video/ogg', '3gp': 'video/3gpp',
};

function ext(name) {
  const m = String(name || '').toLowerCase().match(/\.([a-z0-9]+)(?:$|\?)/);
  return m ? m[1] : '';
}

export function guessMime(name) {
  return MIME[ext(name)] || 'application/octet-stream';
}

export function kindOf(nameOrUrl) {
  return VIDEO_EXT.includes(ext(nameOrUrl)) ? 'video' : 'image';
}
