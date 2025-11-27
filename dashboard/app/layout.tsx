import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🐺 Wolfmen FPL Dashboard',
  description: 'Fantasy Premier League analytics for Wolfmen mini-league',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
