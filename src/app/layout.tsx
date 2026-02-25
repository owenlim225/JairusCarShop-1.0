import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { AppLayout } from '@/components/layout/AppLayout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jairus Car Shop | Philippine Car E-Commerce',
  description:
    'Sa akin quality at mura, san kapa. Browse Toyota, Mitsubishi, and Honda cars in the Philippines.',
  openGraph: {
    title: 'Jairus Car Shop | Philippine Car E-Commerce',
    description:
      'Sa akin quality at mura, san kapa. Toyota, Mitsubishi, Honda.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
