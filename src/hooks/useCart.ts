'use client'

import { useCartContext } from '@/context/CartContext'

/**
 * Global cart state and actions. Must be used inside CartProvider.
 * Navbar and Add to Cart components share this single source of truth.
 */
export function useCart() {
  return useCartContext()
}
