import { getSupabase } from './client'
import type { CartItem } from '@/types'
import { getCarById } from '@/data/cars'

export interface DbCartRow {
  id: string
  session_id: string
  car_id: string
  quantity: number
}

/** Fetch cart items from Supabase and merge with car data */
export async function fetchCart(sessionId: string): Promise<CartItem[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select('id, session_id, car_id, quantity')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[Supabase] fetchCart:', error.message)
    return []
  }

  const items: CartItem[] = []
  for (const row of data ?? []) {
    const car = getCarById(row.car_id)
    if (car) items.push({ ...car, quantity: row.quantity })
  }
  return items
}

/** Add or update quantity for a car in the cart (adds to existing quantity) */
export async function addToCart(
  sessionId: string,
  carId: string,
  addQty: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase()
  if (!supabase)
    return { ok: false, error: 'Supabase not configured' }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('session_id', sessionId)
    .eq('car_id', carId)
    .maybeSingle()

  const newQty = (existing?.quantity ?? 0) + addQty

  const { error } = await supabase.from('cart_items').upsert(
    {
      session_id: sessionId,
      car_id: carId,
      quantity: newQty,
    },
    { onConflict: 'session_id,car_id' }
  )

  if (error) {
    console.error('[Supabase] addToCart:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Set quantity for a cart line; remove if quantity < 1 */
export async function updateCartQuantity(
  sessionId: string,
  carId: string,
  quantity: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase()
  if (!supabase)
    return { ok: false, error: 'Supabase not configured' }

  if (quantity < 1) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId)
      .eq('car_id', carId)
    if (error) {
      console.error('[Supabase] updateCartQuantity delete:', error.message)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('session_id', sessionId)
    .eq('car_id', carId)

  if (error) {
    console.error('[Supabase] updateCartQuantity:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Remove one car from cart */
export async function removeFromCart(
  sessionId: string,
  carId: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase()
  if (!supabase)
    return { ok: false, error: 'Supabase not configured' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId)
    .eq('car_id', carId)

  if (error) {
    console.error('[Supabase] removeFromCart:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Clear all cart items for session */
export async function clearCartDb(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase()
  if (!supabase)
    return { ok: false, error: 'Supabase not configured' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId)

  if (error) {
    console.error('[Supabase] clearCart:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
