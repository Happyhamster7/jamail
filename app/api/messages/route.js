import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { slugify } from '@/lib/config';

const str = (v, max) => String(v ?? '').slice(0, max);

export async function POST(request) {
  if (!process.env.SUBMIT_PASSWORD || request.headers.get('x-password') !== process.env.SUBMIT_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const m = await request.json();
  const first = str(m.firstName, 40).trim();
  const last = str(m.lastName, 40).trim();
  const slug = slugify(`${first} ${last}`);
  if (!first || !slug) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const message = {
    slug,
    firstName: first,
    lastName: last,
    email: str(m.email, 100).trim() || `${slugify(first)}${last ? '.' + slugify(last) : ''}@jamail.com`,
    avatarUrl: str(m.avatarUrl, 500),
    body: str(m.body, 20000),
    attachments: (Array.isArray(m.attachments) ? m.attachments : []).slice(0, 50).map((a) => ({
      url: str(a.url, 500),
      kind: a.kind === 'video' ? 'video' : 'image',
    })),
    createdAt: m.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await put(`data/messages/${slug}.json`, JSON.stringify(message), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
  return NextResponse.json({ ok: true, message });
}
