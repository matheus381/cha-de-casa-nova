import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Chá de Casa Nova | Bem-vindos ao nosso novo lar',
  description:
    'Cada presente escolhido fará parte do começo da nossa nova história. Venha celebrar conosco e nos ajude a montar o nosso novo lar!',
  keywords: ['Chá de Casa Nova', 'Lista de Presentes', 'Casamento', 'Lar', 'Nova História'],
  authors: [{ name: 'Matheus & Carolina' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn('dark font-sans scroll-smooth', inter.variable)}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-violet-600/30 selection:text-violet-200 antialiased">
        {children}
      </body>
    </html>
  );
}
