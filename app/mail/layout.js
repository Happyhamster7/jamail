'use client';
import { ArchiveProvider } from '@/components/ArchiveContext';

export default function MailLayout({ children }) {
  return <ArchiveProvider>{children}</ArchiveProvider>;
}
