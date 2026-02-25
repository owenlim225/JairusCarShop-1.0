'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetCloseButton,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/components/features/CartItem'
import { EmptyCart } from '@/components/features/EmptyCart'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        title="Cart"
        className="flex flex-col gap-4 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle id="cart-drawer-title">Cart ({hydrated ? totalItems : '…'})</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {!hydrated ? (
            <p className="text-sm text-muted-foreground">Loading cart…</p>
          ) : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <motion.ul
              className="flex flex-col gap-3"
              role="list"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.03 } },
              }}
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, x: 8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>

        {hydrated && items.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t border-border pt-4 sm:flex-col">
            <div className="flex w-full justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => clearCart()}
              >
                Clear cart
              </Button>
              <Button asChild className="flex-1">
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  Checkout
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
