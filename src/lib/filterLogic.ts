import type { Car } from '@/types'

export function filterCars(
  cars: Car[],
  searchQuery: string,
  brandFilter: string | null
): Car[] {
  let result = cars

  if (brandFilter) {
    result = result.filter((c) => c.brand === brandFilter)
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    result = result.filter(
      (c) =>
        c.model.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
    )
  }

  return result
}
