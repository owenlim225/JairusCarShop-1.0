import type { Brand } from '@/types'

export const BRANDS: Brand[] = ['Toyota', 'Mitsubishi', 'Honda']

export const BRAND_OPTIONS = BRANDS.map((b) => ({ value: b, label: b }))

export const CART_STORAGE_KEY = 'jairus-car-shop-cart'
/** Guest session id for Supabase cart (persisted in localStorage) */
export const CART_SESSION_KEY = 'jairus-car-shop-session'
