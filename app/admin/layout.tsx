import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Chá de Casa Nova',
  description: 'Painel administrativo da lista de presentes',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
