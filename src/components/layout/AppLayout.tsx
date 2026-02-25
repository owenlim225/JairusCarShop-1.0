'use client'

import { useState } from 'react'
import { CartProvider } from '@/context/CartContext'
import { Layout } from '@/components/layout/Layout'
import { CartDrawer } from '@/components/features/CartDrawer'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <CartProvider>
      <Layout onCartClick={() => setCartOpen(true)}>
        {children}
      </Layout>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </CartProvider>
  )
}
