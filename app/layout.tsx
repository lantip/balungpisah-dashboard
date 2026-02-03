import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Balungpisah Dashboard',
  description: 'Admin dashboard for monitoring Balungpisah reports and tickets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
