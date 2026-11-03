import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let password;
        try {
          password = JSON.parse(clientPayload || '{}').password;
        } catch {}
        if (!process.env.SUBMIT_PASSWORD || password !== process.env.SUBMIT_PASSWORD) {
          throw new Error('Wrong password');
        }
        if (!pathname.startsWith('uploads/')) throw new Error('Invalid upload path');
        return {
          allowedContentTypes: ['image/*', 'video/*'],
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
