'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CARS } from '@/data/cars'
import { filterCars } from '@/lib/filterLogic'
import { FilterBar } from '@/components/features/FilterBar'
import { ProductGrid } from '@/components/features/ProductGrid'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const filteredCars = useMemo(
    () => filterCars(CARS, searchQuery, brandFilter),
    [searchQuery, brandFilter]
  )

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <section aria-label="Hero" className="mb-8 text-center">
        <motion.h1
          className="font-display text-3xl font-bold text-foreground sm:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Jairus Car Shop
        </motion.h1>
        <motion.p
          className="mt-2 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Sa akin quality at mura, san kapa.
        </motion.p>
      </section>

      <motion.section
        aria-label="Catalog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          brandFilter={brandFilter}
          onBrandChange={setBrandFilter}
          className="mb-8"
        />
        <ProductGrid cars={filteredCars} />
      </motion.section>
    </div>
  )
}
