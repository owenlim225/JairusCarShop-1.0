'use client'

import { BRAND_OPTIONS } from '@/data/constants'
import { cn } from '@/lib/utils'

interface BrandFilterProps {
  value: string | null
  onChange: (brand: string | null) => void
  className?: string
}

export function BrandFilter({ value, onChange, className }: BrandFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Filter by brand">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          'rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200',
          value === null
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input bg-background text-foreground hover:bg-muted'
        )}
        aria-pressed={value === null}
      >
        All
      </button>
      {BRAND_OPTIONS.map(({ value: optValue, label }) => (
        <button
          key={optValue}
          type="button"
          onClick={() => onChange(optValue)}
          className={cn(
            'rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200',
            value === optValue
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-input bg-background text-foreground hover:bg-muted'
          )}
          aria-pressed={value === optValue}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
