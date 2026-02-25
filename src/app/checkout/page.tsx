'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { CheckoutModal } from '@/components/features/CheckoutModal'
import { Button } from '@/components/ui/button'
import { EmptyCart } from '@/components/features/EmptyCart'

export default function CheckoutPage() {
  const { items, hydrated } = useCart()
  const [modalOpen, setModalOpen] = useState(false)

  const isEmpty = hydrated && items.length === 0

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review your order and confirm.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {!hydrated ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground">
              You have {items.length} item{items.length === 1 ? '' : 's'} in your
              cart. Click below to complete your order.
            </p>
            <Button
              size="lg"
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto"
            >
              Open checkout form
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cart">Back to cart</Link>
            </Button>
          </div>
        )}
      </motion.section>

      <CheckoutModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
