'use client'

import { motion } from 'framer-motion'
import type { Car } from '@/types'
import { ProductCard } from '@/components/features/ProductCard'

interface ProductGridProps {
  cars: Car[]
}

export function ProductGrid({ cars }: ProductGridProps) {
  if (cars.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-full rounded-xl border border-dashed border-border bg-muted/40 py-12 text-center text-muted-foreground"
      >
        No cars match your filters. Try a different search or brand.
      </motion.p>
    )
  }

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
    >
      {cars.map((car, index) => (
        <li key={car.id} role="listitem">
          <ProductCard car={car} index={index} />
        </li>
      ))}
    </motion.ul>
  )
}
