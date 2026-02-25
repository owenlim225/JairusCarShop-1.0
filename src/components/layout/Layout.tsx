'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface LayoutProps {
  children: React.ReactNode
  onCartClick?: () => void
}

export function Layout({ children, onCartClick }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header onCartClick={onCartClick} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
