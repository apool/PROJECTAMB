import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'American Burguer | Hambúrguer Artesanal na Brasa — Coronel Vivida',
    template: '%s | American Burguer',
  },
  description:
    'Hambúrguer artesanal feito na brasa em Coronel Vivida. Delivery rápido, ingredientes frescos e sabor incomparável. Peça agora pelo WhatsApp!',
  keywords: [
    'hamburguer artesanal',
    'delivery coronel vivida',
    'american burguer',
    'hamburger na brasa',
    'lanche coronel vivida',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://americanburguer.com.br',
    siteName: 'American Burguer',
    title: 'American Burguer | Hambúrguer Artesanal na Brasa',
    description: 'Onde o sabor encontra a qualidade. Hambúrguer artesanal feito na brasa em Coronel Vivida.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'American Burguer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'American Burguer | Hambúrguer Artesanal na Brasa',
    description: 'Onde o sabor encontra a qualidade.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] antialiased">
        {children}
      </body>
    </html>
  )
}
