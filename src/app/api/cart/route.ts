import { NextRequest, NextResponse } from 'next/server'
import {
  fetchCartServer,
  addToCartServer,
  updateCartQuantityServer,
  removeFromCartServer,
  clearCartServer,
} from '@/lib/supabase/cart-server'

const SESSION_HEADER = 'x-cart-session'

function getSessionId(request: NextRequest): string | null {
  return request.headers.get(SESSION_HEADER) || request.nextUrl.searchParams.get('sessionId')
}

/** GET /api/cart – return cart for session (persistent storage). */
export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request)
    if (!sessionId) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }
    const items = await fetchCartServer(sessionId)
    return NextResponse.json({ items })
  } catch (err) {
    console.error('[API cart GET]', err)
    return NextResponse.json(
      { error: 'Failed to load cart' },
      { status: 500 }
    )
  }
}

/** POST /api/cart – add / update / remove / clear (async, persists to DB). */
export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request)
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session' }, { status: 400 })
    }

    const body = await request.json()
    const { action, carId, quantity } = body as {
      action: 'add' | 'update' | 'remove' | 'clear'
      carId?: string
      quantity?: number
    }

    switch (action) {
      case 'add': {
        if (!carId || quantity == null) {
          return NextResponse.json({ error: 'Missing carId or quantity' }, { status: 400 })
        }
        const result = await addToCartServer(sessionId, carId, Number(quantity) || 1)
        if (!result.ok) {
          return NextResponse.json({ error: result.error }, { status: 502 })
        }
        const items = await fetchCartServer(sessionId)
        return NextResponse.json({ items })
      }
      case 'update': {
        if (!carId || quantity == null) {
          return NextResponse.json({ error: 'Missing carId or quantity' }, { status: 400 })
        }
        const result = await updateCartQuantityServer(sessionId, carId, Number(quantity))
        if (!result.ok) {
          return NextResponse.json({ error: result.error }, { status: 502 })
        }
        const items = await fetchCartServer(sessionId)
        return NextResponse.json({ items })
      }
      case 'remove': {
        if (!carId) {
          return NextResponse.json({ error: 'Missing carId' }, { status: 400 })
        }
        const result = await removeFromCartServer(sessionId, carId)
        if (!result.ok) {
          return NextResponse.json({ error: result.error }, { status: 502 })
        }
        const items = await fetchCartServer(sessionId)
        return NextResponse.json({ items })
      }
      case 'clear': {
        const result = await clearCartServer(sessionId)
        if (!result.ok) {
          return NextResponse.json({ error: result.error }, { status: 502 })
        }
        return NextResponse.json({ items: [] })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (err) {
    console.error('[API cart POST]', err)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
