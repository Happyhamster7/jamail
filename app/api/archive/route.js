import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { loadArchive } from '@/lib/archive';
import { VIEW_PIN } from '@/lib/config';

export const dynamic = 'force-dynamic';

const isFriend = (req) =>
  !!process.env.SUBMIT_PASSWORD && req.headers.get('x-password') === process.env.SUBMIT_PASSWORD;

export async function GET(request) {
  if (request.headers.get('x-pin') !== VIEW_PIN && !isFriend(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json(await loadArchive());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Friends can delete an uploaded file or a whole message from /submit.
export async function DELETE(request) {
  if (!isFriend(request)) return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  const { url } = await request.json();
  let host = '';
  try {
    host = new URL(url).hostname;
  } catch {}
  if (!host.endsWith('.blob.vercel-storage.com')) {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }
  await del(url);
  return NextResponse.json({ ok: true });
}
