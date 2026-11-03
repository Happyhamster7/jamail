'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cat from '@/components/Cat';
import { setPin } from '@/components/ArchiveContext';
import { SHIV_EMAIL, VIEW_PIN } from '@/lib/config';

export default function Login() {
  const router = useRouter();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [err, setErr] = useState('');
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState(0);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const setAt = (i, v) => {
    const clean = v.replace(/\D/g, '');
    if (!clean) {
      setDigits((d) => d.map((x, j) => (j === i ? '' : x)));
      return;
    }
    // Supports typing one digit or pasting all four.
    setDigits((d) => {
      const next = [...d];
      clean.split('').slice(0, 4 - i).forEach((c, k) => (next[i + k] = c));
      return next;
    });
    const nextIdx = Math.min(3, i + clean.length);
    refs[nextIdx].current?.focus();
    setErr('');
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
    if (e.key === 'Enter') submit();
  };

  const submit = () => {
    if (digits.join('') === VIEW_PIN) {
      setPin(VIEW_PIN);
      router.push('/mail');
    } else {
      setErr('Incorrect password. Jam Jam is disappointed in you.');
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setDigits(['', '', '', '']);
      refs[0].current?.focus();
    }
  };

  const hints = ['Forgot password?', 'Hint: ask Jam Jam 🐾', 'Jam Jam says… 2 4 1 0'];

  return (
    <main className="page with-cat">
      <h1 className="welcome">Welcome back Shivani!</h1>
      <div className={`card ${shake ? 'shake' : ''}`}>
        <label className="field-label" htmlFor="email">email</label>
        <input id="email" className="input" value={SHIV_EMAIL} readOnly />
        <label className="field-label" style={{ marginTop: 18 }}>password</label>
        <div className="pin">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              type="password"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        <p className="err" role="alert">{err}</p>
        <button className="link-btn" style={{ marginTop: 4 }} onClick={() => setHint((h) => Math.min(2, h + 1))}>
          {hints[hint]}
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button className="btn" style={{ minWidth: 180 }} onClick={submit} disabled={digits.some((d) => !d)}>
          Log in
        </button>
      </div>
      <Cat photo="login" />
    </main>
  );
}
