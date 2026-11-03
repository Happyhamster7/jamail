'use client';
import { upload } from '@vercel/blob/client';
import { guessMime, safeFileName } from './config';

// Uploads a file straight from the browser to Vercel Blob (bypasses the
// serverless body-size limit, so big phone videos work).
export async function uploadFile(file, dir, password, onProgress, prefix = '') {
  const pathname = `${dir}/${prefix}${safeFileName(file.name)}`;
  const blob = await upload(pathname, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: JSON.stringify({ password }),
    contentType: file.type || guessMime(file.name),
    multipart: file.size > 20 * 1024 * 1024,
    onUploadProgress: (e) => onProgress?.(e.percentage),
  });
  return blob.url;
}
