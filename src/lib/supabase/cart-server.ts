import { getSupabaseServer } from './server'
import type { CartItem } from '@/types'
import { getCarById } from '@/data/cars'

/** Server-side: fetch cart from DB (for API routes). */
export async function fetchCartServer(sessionId: string): Promise<CartItem[]> {
  const supabase = getSupabaseServer()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select('id, session_id, car_id, quantity')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[Supabase Server] fetchCart:', error.message)
    return []
  }

  const items: CartItem[] = []
  for (const row of data ?? []) {
    const car = getCarById(row.car_id)
    if (car) items.push({ ...car, quantity: row.quantity })
  }
  return items
}

/** Server-side: add to cart (for API routes). */
export async function addToCartServer(
  sessionId: string,
  carId: string,
  addQty: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseServer()
  if (!supabase) return { ok: false, error: 'Supabase not configured' }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('session_id', sessionId)
    .eq('car_id', carId)
    .maybeSingle()

  const newQty = (existing?.quantity ?? 0) + addQty

  const { error } = await supabase.from('cart_items').upsert(
    { session_id: sessionId, car_id: carId, quantity: newQty },
    { onConflict: 'session_id,car_id' }
  )

  if (error) {
    console.error('[Supabase Server] addToCart:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Server-side: update quantity (for API routes). */
export async function updateCartQuantityServer(
  sessionId: string,
  carId: string,
  quantity: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseServer()
  if (!supabase) return { ok: false, error: 'Supabase not configured' }

  if (quantity < 1) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId)
      .eq('car_id', carId)
    return error ? { ok: false, error: error.message } : { ok: true }
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('session_id', sessionId)
    .eq('car_id', carId)

  return error ? { ok: false, error: error.message } : { ok: true }
}

/** Server-side: remove item (for API routes). */
export async function removeFromCartServer(
  sessionId: string,
  carId: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseServer()
  if (!supabase) return { ok: false, error: 'Supabase not configured' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId)
    .eq('car_id', carId)

  return error ? { ok: false, error: error.message } : { ok: true }
}

/** Server-side: clear cart (for API routes). */
export async function clearCartServer(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseServer()
  if (!supabase) return { ok: false, error: 'Supabase not configured' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId)

  return error ? { ok: false, error: error.message } : { ok: true }
}
