import { Nunito, Caveat } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-body' });
const caveat = Caveat({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-hand' });

export const metadata = {
  title: 'JAMail',
  description: 'You have 1 new message.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fff8f1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
