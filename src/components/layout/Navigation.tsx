'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
] as const

export function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Main navigation" className="flex items-center">
      <ul className="hidden items-center gap-1 sm:flex">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-primary-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div
          id="mobile-menu"
          className={cn(
            'absolute left-0 right-0 top-16 border-b border-border bg-background shadow-lg transition-all duration-300 ease-out',
            open ? 'block opacity-100' : 'hidden opacity-0'
          )}
          role="dialog"
          aria-label="Mobile menu"
        >
          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-primary-muted"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
