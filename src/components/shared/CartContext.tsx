'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useCart } from '@/hooks/useCart'
import type { CartItem, MenuItem, Extra } from '@/types'

type CartContextType = {
  items: CartItem[]
  total: number
  count: number
  whatsappUrl: string
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (menuItem: MenuItem, extras?: Extra[], observation?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <CartContext.Provider
      value={{
        ...cart,
        cartOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
