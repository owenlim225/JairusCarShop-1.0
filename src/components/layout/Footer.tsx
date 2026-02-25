import Link from 'next/link'
import { Car } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-border bg-muted/40"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <Car className="h-5 w-5 text-primary" aria-hidden />
            <span>Jairus Car Shop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sa akin quality at mura, san kapa.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Home
          </Link>
          <Link
            href="/cart"
            className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Cart
          </Link>
          <Link
            href="/checkout"
            className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Checkout
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Jairus Car Shop. Philippine car e-commerce.
        </p>
      </div>
    </footer>
  )
}
