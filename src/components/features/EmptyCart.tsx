'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 py-12 px-4 text-center"
      role="status"
      aria-label="Cart is empty"
    >
      <ShoppingBag
        className="h-12 w-12 text-muted-foreground"
        aria-hidden
      />
      <p className="text-muted-foreground">Your cart is empty.</p>
      <p className="text-sm text-muted-foreground">
        Browse our cars and add something you like.
      </p>
      <Button asChild variant="default">
        <Link href="/">View cars</Link>
      </Button>
    </div>
  )
}
