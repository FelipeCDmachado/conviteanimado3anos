import type { Metadata } from 'next'
import { Pacifico, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _pacifico = Pacifico({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pacifico'
});

const _poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Aniversário Maria Júlia - 3 Anos',
  description: 'Convite de aniversário da pequena Maria Júlia - Tema A Pequena Sereia',
  generator: 'v0.app',
  icons: {
    icon: '/ariel.png',
    shortcut: '/ariel.png',
    apple: '/ariel.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${_pacifico.variable} ${_poppins.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
