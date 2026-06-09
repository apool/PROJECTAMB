export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  position: number
  created_at: string
}

export type MenuItem = {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  extras: Extra[] | null
  position: number
  created_at: string
  updated_at: string
  category?: Category
}

export type Extra = {
  name: string
  price: number
}

export type CartItem = {
  id: string
  menuItem: MenuItem
  quantity: number
  extras: Extra[]
  observation: string
}

export type Cart = {
  items: CartItem[]
  total: number
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}
