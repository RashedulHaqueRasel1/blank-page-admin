import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/dashboard/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Blank Page Admin',
  description: 'Premium Admin Dashboard for Blank Page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
