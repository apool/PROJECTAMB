'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCartContext } from '@/components/shared/CartContext'
import type { Combo } from '@/types'

export function ComboCard({ combo }: { combo: Combo }) {
  const { addItem } = useCartContext()
  const displayPrice = combo.promotional_price ?? combo.price

  function handleAdd() {
    addItem(
      {
        id: combo.id,
        name: combo.name,
        description: combo.description ?? '',
        price: combo.price,
        promotional_price: combo.promotional_price,
        image_url: combo.image_url,
        is_available: combo.is_available,
        is_featured: false,
        extras: null,
        position: combo.position,
        category_id: 'combo',
        created_at: combo.created_at,
        updated_at: combo.created_at,
      },
      [],
      ''
    )
  }

  return (
    <div className="group bg-surface-2 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-600/30 transition-all">
      <div className="relative h-44 w-full overflow-hidden bg-surface-3">
        {combo.image_url ? (
          <Image
            src={combo.image_url}
            alt={combo.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍔</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-transparent to-transparent" />

        {combo.promotional_price && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PROMO
          </span>
        )}
        <span className="absolute top-3 right-3 bg-brand-600/90 text-white text-xs font-bold px-2 py-1 rounded-full">
          COMBO
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-xl tracking-wide mb-1">{combo.name}</h3>

        {combo.items.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {combo.items.map((item, i) => (
              <span key={i} className="text-xs bg-surface-3 border border-white/5 px-2 py-0.5 rounded-full text-white/50">
                {item.quantity > 1 ? `${item.quantity}× ` : ''}{item.name}
              </span>
            ))}
          </div>
        )}

        {combo.description && (
          <p className="text-white/40 text-sm mb-3 line-clamp-2">{combo.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xl text-brand-600">{formatCurrency(displayPrice)}</span>
            {combo.promotional_price && (
              <span className="text-white/30 text-sm line-through ml-2">{formatCurrency(combo.price)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Pedir
          </button>
        </div>
      </div>
    </div>
  )
}
