export type Brand = 'Toyota' | 'Mitsubishi' | 'Honda'

export interface Car {
  id: string
  brand: Brand
  model: string
  price: number
  engine: string
  transmission: string
  seating: number
  image: string
  imageAlt: string
  specs: string[]
}

export interface CartItem extends Car {
  quantity: number
}

export interface CheckoutForm {
  name: string
  address: string
  phone?: string
}
