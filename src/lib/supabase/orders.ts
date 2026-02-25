import { getSupabase } from './client'
import type { CheckoutForm } from '@/types'
import type { CartItem } from '@/types'

export interface CreateOrderInput {
  sessionId: string | null
  form: CheckoutForm
  items: CartItem[]
  total: number
}

export interface CreateOrderResult {
  ok: boolean
  orderId?: string
  error?: string
}

/** Create an order and order_items from cart; does not clear cart (caller should clear cart after) */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const supabase = getSupabase()
  if (!supabase)
    return { ok: false, error: 'Supabase not configured' }

  const { sessionId, form, items, total } = input
  if (items.length === 0) return { ok: false, error: 'Cart is empty' }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      session_id: sessionId ?? null,
      customer_name: form.name.trim(),
      customer_address: form.address.trim(),
      customer_phone: form.phone?.trim() || null,
      total,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('[Supabase] createOrder:', orderError?.message)
    return { ok: false, error: orderError?.message ?? 'Failed to create order' }
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    car_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    console.error('[Supabase] order_items insert:', itemsError.message)
    await getSupabase()?.from('orders').delete().eq('id', order.id)
    return { ok: false, error: itemsError.message }
  }

  return { ok: true, orderId: order.id }
}
