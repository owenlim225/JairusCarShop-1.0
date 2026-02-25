'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/components/features/CartItem'
import { EmptyCart } from '@/components/features/EmptyCart'

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
    hydrated,
  } = useCart()

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Your cart
        </h1>
        <p className="mt-1 text-muted-foreground">
          {hydrated
            ? `${totalItems} item${totalItems === 1 ? '' : 's'}`
            : 'Loading…'}
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {!hydrated ? (
          <p className="text-muted-foreground">Loading cart…</p>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <ul className="flex-1 space-y-3" role="list">
              {items.map((item) => (
                <li key={item.id}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:w-80">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatPrice(subtotal)}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => clearCart()}
                >
                  Clear cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  )
}
