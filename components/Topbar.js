'use client';
import { useRouter } from 'next/navigation';
import { Back } from './Icons';

export default function Topbar({ back, title, right }) {
  const router = useRouter();
  return (
    <div className="topbar">
      {back ? (
        <button className="icon-btn" onClick={() => router.push(back)} aria-label="Back"><Back /></button>
      ) : (
        <span style={{ width: 44 }} />
      )}
      <div className="title">{title}</div>
      {right ?? <div className="mini-brand">JA<span>M</span>ail</div>}
    </div>
  );
}
