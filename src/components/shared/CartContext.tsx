'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCart } from '@/hooks/useCart'
import type { CartItem, MenuItem, Extra } from '@/types'

type CartContextType = {
  items: CartItem[]
  total: number
  count: number
  whatsappUrl: string
  addItem: (menuItem: MenuItem, extras?: Extra[], observation?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart()
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
