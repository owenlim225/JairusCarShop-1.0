'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Car, CartItem } from '@/types'
import { CART_STORAGE_KEY, CART_SESSION_KEY } from '@/data/constants'

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(CART_SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CART_SESSION_KEY, id)
  }
  return id
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item === 'object' &&
        'id' in item &&
        'quantity' in item &&
        typeof (item as CartItem).quantity === 'number' &&
        (item as CartItem).quantity > 0
    )
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

const API_CART = '/api/cart'
const FETCH_TIMEOUT_MS = 15000

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = FETCH_TIMEOUT_MS, ...init } = options
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

async function fetchCartFromApi(sessionId: string): Promise<CartItem[]> {
  const res = await fetchWithTimeout(API_CART, {
    headers: { [SESSION_HEADER]: sessionId },
  })
  if (!res.ok) throw new Error('Failed to load cart')
  const data = await res.json()
  return data.items ?? []
}

const SESSION_HEADER = 'x-cart-session'

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  hydrated: boolean
  error: string | null
  /** Id of the car currently being added (loading state for that button). */
  addingId: string | null
  /** Reusable async add-to-cart with optimistic UI and rollback on failure. */
  handleAddToCart: (car: Car, quantity?: number) => Promise<void>
  /** Alias for handleAddToCart for compatibility. */
  addItem: (car: Car, quantity?: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  sessionId: string | null
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return getOrCreateSessionId()
  }, [])

  // Initial load: try API first, fallback to localStorage
  useEffect(() => {
    const sid = getOrCreateSessionId()
    setSessionId(sid)

    fetchCartFromApi(sid)
      .then((apiItems) => {
        setItems(apiItems.length > 0 ? apiItems : loadCartFromStorage())
        saveCartToStorage(apiItems.length > 0 ? apiItems : loadCartFromStorage())
      })
      .catch(() => {
        setItems(loadCartFromStorage())
      })
      .finally(() => setHydrated(true))
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveCartToStorage(items)
  }, [items, hydrated])

  const refetchCart = useCallback(async () => {
    const sid = getSessionId()
    if (!sid) return
    try {
      const apiItems = await fetchCartFromApi(sid)
      setItems(apiItems)
      saveCartToStorage(apiItems)
    } catch {
      setItems(loadCartFromStorage())
    }
  }, [getSessionId])

  const handleAddToCart = useCallback(
    async (car: Car, quantity = 1) => {
      setError(null)
      const sid = getSessionId()

      // Optimistic update: update UI immediately
      setItems((prev) => {
        const existing = prev.find((i) => i.id === car.id)
        if (existing) {
          return prev.map((i) =>
            i.id === car.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        }
        return [...prev, { ...car, quantity }]
      })

      setAddingId(car.id)
      try {
        const res = await fetchWithTimeout(API_CART, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [SESSION_HEADER]: sid,
          },
          body: JSON.stringify({ action: 'add', carId: car.id, quantity }),
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error ?? 'Failed to add to cart')
        }
        if (Array.isArray(data.items)) {
          setItems(data.items)
          saveCartToStorage(data.items)
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? (err.name === 'AbortError' ? 'Request timed out' : err.message)
            : 'Failed to add to cart'
        setError(message)
        await refetchCart()
      } finally {
        setAddingId(null)
      }
    },
    [getSessionId, refetchCart]
  )

  const removeItem = useCallback(
    async (id: string) => {
      setError(null)
      const prevItems = items
      setItems((prev) => prev.filter((i) => i.id !== id))

      const sid = getSessionId()
      try {
        const res = await fetch(API_CART, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', [SESSION_HEADER]: sid },
          body: JSON.stringify({ action: 'remove', carId: id }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? 'Failed to remove')
        if (Array.isArray(data.items)) {
          setItems(data.items)
          saveCartToStorage(data.items)
        }
      } catch {
        setError('Failed to remove')
        setItems(prevItems)
        await refetchCart()
      }
    },
    [getSessionId, items, refetchCart]
  )

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      setError(null)
      if (quantity < 1) {
        await removeItem(id)
        return
      }
      const prevItems = items
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))

      const sid = getSessionId()
      try {
        const res = await fetch(API_CART, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', [SESSION_HEADER]: sid },
          body: JSON.stringify({ action: 'update', carId: id, quantity }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? 'Failed to update')
        if (Array.isArray(data.items)) {
          setItems(data.items)
          saveCartToStorage(data.items)
        }
      } catch {
        setError('Failed to update')
        setItems(prevItems)
        await refetchCart()
      }
    },
    [getSessionId, items, removeItem, refetchCart]
  )

  const clearCart = useCallback(async () => {
    setError(null)
    setItems([])

    const sid = getSessionId()
    try {
      const res = await fetch(API_CART, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [SESSION_HEADER]: sid },
        body: JSON.stringify({ action: 'clear' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Failed to clear')
    } catch {
      setError('Failed to clear cart')
      await refetchCart()
    }
  }, [getSessionId, refetchCart])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    hydrated,
    error,
    addingId,
    handleAddToCart,
    addItem: handleAddToCart,
    removeItem,
    updateQuantity,
    clearCart,
    sessionId,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
