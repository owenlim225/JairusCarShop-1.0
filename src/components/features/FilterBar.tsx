'use client'

import { SearchInput } from '@/components/features/SearchInput'
import { BrandFilter } from '@/components/features/BrandFilter'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  brandFilter: string | null
  onBrandChange: (brand: string | null) => void
  className?: string
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  brandFilter,
  onBrandChange,
  className,
}: FilterBarProps) {
  return (
    <section
      aria-label="Filter catalog"
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full sm:max-w-xs"
      />
      <BrandFilter value={brandFilter} onChange={onBrandChange} />
    </section>
  )
}
