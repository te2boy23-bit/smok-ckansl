import type { Metadata, Viewport } from 'next';
import { Comfortaa, Nunito_Sans } from 'next/font/google';
import './globals.css';

const comfortaa = Comfortaa({
  variable: '--font-comfortaa',
  subsets: ['latin'],
  display: 'swap',
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'すいすい（息抜き相棒）— 禁煙サポートアプリ',
  description: 'ユーザーを一切責めず、日々の小さな我慢を徹底的に褒めちぎる脱タバコ相棒アプリ。白・黒・オレンジ完全排除の安らぎグリーンUI。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'すいすい',
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${comfortaa.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#04140d] text-[#ecfdf5]">
        {children}
      </body>
    </html>
  );
}
