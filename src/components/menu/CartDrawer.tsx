'use client'

import { X, ShoppingCart, Trash2, Plus, Minus, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useCartContext } from '../shared/CartContext'
import { formatCurrency, getItemTotal } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, total, count, whatsappUrl, removeItem, updateQuantity, clearCart } =
    useCartContext()

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrinho de pedidos"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-surface flex flex-col border-l border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-600" />
            <h2 className="font-display text-2xl tracking-wider">
              MEU PEDIDO
              {count > 0 && (
                <span className="ml-2 text-sm font-sans font-normal text-white/50">
                  ({count} {count === 1 ? 'item' : 'itens'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingCart className="w-16 h-16 text-white/10" />
              <p className="text-white/40 text-sm">
                Seu carrinho está vazio. <br />
                Adicione itens do cardápio!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-surface-2 rounded-xl p-3"
              >
                {item.menuItem.image_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.menuItem.image_url}
                      alt={item.menuItem.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.menuItem.name}</p>
                  <p className="text-brand-600 text-sm font-bold mt-0.5">
                    {formatCurrency(getItemTotal(item))}
                  </p>
                  {item.observation && (
                    <p className="text-white/40 text-xs mt-1 truncate">
                      📝 {item.observation}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/30 hover:text-red-400 transition-colors"
                    aria-label={`Remover ${item.menuItem.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center hover:bg-brand-600 transition-colors"
                      aria-label="Diminuir"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center hover:bg-brand-600 transition-colors"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Total</span>
              <span className="font-display text-2xl text-brand-600 tracking-wider">
                {formatCurrency(total)}
              </span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fba58] text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Finalizar pelo WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={clearCart}
              className="w-full text-center text-white/30 hover:text-white/60 text-xs py-1 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
