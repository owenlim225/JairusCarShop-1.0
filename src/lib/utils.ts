import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price in Philippine Peso (₱) with thousands separator */
export function formatPrice(amount: number): string {
  return `₱${amount.toLocaleString('en-PH')}`
}
