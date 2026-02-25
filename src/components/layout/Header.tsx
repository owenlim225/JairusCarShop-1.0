'use client'

import Link from 'next/link'
import { Car, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/layout/Navigation'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onCartClick?: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const { totalItems, hydrated } = useCart()

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      role="banner"
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          aria-label="Jairus Car Shop - Home"
        >
          <Car className="h-6 w-6 text-primary" aria-hidden />
          <span>Jairus Car Shop</span>
        </Link>

        <Navigation />

        <div className="flex items-center gap-2">
          {onCartClick ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative transition-transform duration-200 hover:scale-105"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden />
              {hydrated && totalItems > 0 && (
                <span
                  className={cn(
                    'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground',
                    totalItems > 99 && 'text-[10px]'
                  )}
                  aria-hidden
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative transition-transform duration-200 hover:scale-105"
            >
              <Link
                href="/cart"
                aria-label={`View cart, ${totalItems} items`}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden />
                {hydrated && totalItems > 0 && (
                  <span
                    className={cn(
                      'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground',
                      totalItems > 99 && 'text-[10px]'
                    )}
                    aria-hidden
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
