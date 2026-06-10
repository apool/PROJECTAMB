'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { useCartContext } from '../shared/CartContext'
import { AddToCartModal } from './AddToCartModal'
import { formatCurrency } from '@/lib/utils'
import type { MenuItem, Extra } from '@/types'

type Props = {
  item: MenuItem
}

export function MenuCard({ item }: Props) {
  const { addItem } = useCartContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [added, setAdded] = useState(false)

  const effectivePrice = item.promotional_price ?? item.price

  function handleConfirm(extras: Extra[], observation: string) {
    addItem(item, extras, observation)
    setModalOpen(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <>
      <article className="group relative bg-surface-2 rounded-2xl overflow-hidden border border-white/5 hover:border-brand-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/30 flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-surface-3">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍔</div>
          )}
          <div className="absolute inset-0 bg-card-gradient" />

          {item.is_featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 fill-white" />
              DESTAQUE
            </div>
          )}

          {item.promotional_price && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              PROMO
            </div>
          )}

          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-black/80 text-white/60 text-sm font-medium px-4 py-2 rounded-full">
                Indisponível
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="font-display text-xl tracking-wide text-white">{item.name}</h3>
            <p className="text-white/50 text-sm mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>

          {Array.isArray(item.extras) && item.extras.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.extras.map((extra) => (
                <span
                  key={extra.name}
                  className="text-xs text-white/40 border border-white/10 rounded-full px-2 py-0.5"
                >
                  +{extra.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="font-display text-2xl text-brand-600 tracking-wider">
                {formatCurrency(effectivePrice)}
              </span>
              {item.promotional_price && (
                <span className="text-white/30 text-xs line-through leading-none">
                  {formatCurrency(item.price)}
                </span>
              )}
            </div>
            <button
              onClick={() => setModalOpen(true)}
              disabled={!item.is_available || added}
              aria-label={`Adicionar ${item.name} ao carrinho`}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${added
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 scale-95'
                  : item.is_available
                  ? 'bg-brand-600 hover:bg-brand-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
                }
              `}
            >
              {added ? '✓ Adicionado' : <><Plus className="w-4 h-4" />Adicionar</>}
            </button>
          </div>
        </div>
      </article>

      {modalOpen && (
        <AddToCartModal
          item={item}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  )
}
