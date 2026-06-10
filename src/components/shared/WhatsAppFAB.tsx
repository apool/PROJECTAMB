'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartContext } from './CartContext'

export function WhatsAppFAB() {
  const { count, openCart } = useCartContext()

  if (count === 0) return null

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-brand-900/40 transition-all hover:scale-105 active:scale-95"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="text-sm font-semibold">
        Ver pedido ({count})
      </span>
    </button>
  )
}
