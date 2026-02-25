'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Car } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { Check, Loader2, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  car: Car
  index?: number
}

export function ProductCard({ car, index = 0 }: ProductCardProps) {
  const { handleAddToCart, addingId } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const isAdding = addingId === car.id

  const handleAdd = async () => {
    await handleAddToCart(car, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={car.image}
          alt={car.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground shadow">
          {car.brand}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="font-display text-lg font-semibold text-card-foreground">
          {car.model}
        </h2>
        <ul className="text-sm text-muted-foreground" aria-label="Key specs">
          <li>{car.engine}</li>
          <li>{car.transmission} • {car.seating} seats</li>
        </ul>
        <p className="mt-auto text-xl font-semibold text-primary">
          {formatPrice(car.price)}
        </p>
        <Button
          onClick={handleAdd}
          disabled={isAdding}
          className="w-full transition-all duration-200"
          aria-label={
            isAdding
              ? 'Adding to cart…'
              : justAdded
                ? 'Added to cart'
                : `Add ${car.model} to cart`
          }
        >
          {isAdding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Adding…
            </>
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Add to cart
            </>
          )}
        </Button>
      </div>
    </motion.article>
  )
}
