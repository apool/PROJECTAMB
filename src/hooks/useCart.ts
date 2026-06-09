'use client'

import { useState, useCallback } from 'react'
import type { CartItem, MenuItem, Extra } from '@/types'
import { getCartTotal, buildWhatsAppMessage } from '@/lib/utils'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback(
    (menuItem: MenuItem, extras: Extra[] = [], observation = '') => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.menuItem.id === menuItem.id
        )
        if (existing) {
          return prev.map((i) =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
        return [
          ...prev,
          {
            id: `${menuItem.id}-${Date.now()}`,
            menuItem,
            quantity: 1,
            extras,
            observation,
          },
        ]
      })
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = getCartTotal(items)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  const whatsappUrl = buildWhatsAppMessage(items)

  return {
    items,
    total,
    count,
    whatsappUrl,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
