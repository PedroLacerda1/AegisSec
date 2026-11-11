import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AegisSec Defense Ops - Cybersecurity Manager',
  description:
    'Plataforma de Operações de Ciberdefesa SOC com Gestão de Vulnerabilidades CVE, Remediação SOAR, Postura de Segurança e Integração Supabase/PostgreSQL.',
  openGraph: {
    title: 'AegisSec Defense Ops - Cybersecurity Manager',
    description:
      'Plataforma de Operações de Ciberdefesa SOC com Gestão de Vulnerabilidades CVE, Remediação SOAR, Postura de Segurança e Integração Supabase/PostgreSQL.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AegisSec Defense Ops - Cybersecurity Manager',
    description:
      'Plataforma de Operações de Ciberdefesa SOC com Gestão de Vulnerabilidades CVE, Remediação SOAR, Postura de Segurança e Integração Supabase/PostgreSQL.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
