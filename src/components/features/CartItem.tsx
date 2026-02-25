'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  className?: string
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <article
      className={cn(
        'flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors',
        className
      )}
      aria-label={`${item.model}, quantity ${item.quantity}`}
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-card-foreground truncate">{item.model}</p>
        <p className="text-sm text-muted-foreground">{item.brand}</p>
        <p className="mt-1 font-semibold text-primary">
          {formatPrice(item.price * item.quantity)}
        </p>
        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.model}`}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="min-w-6 text-center text-sm font-medium" aria-live="polite">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.model}`}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(item.id)}
            className="ml-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Remove ${item.model} from cart`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </article>
  )
}
