'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import type { MenuItem, Extra } from '@/types'

type Props = {
  item: MenuItem
  onClose: () => void
  onConfirm: (extras: Extra[], observation: string) => void
}

export function AddToCartModal({ item, onClose, onConfirm }: Props) {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const [observation, setObservation] = useState('')

  const basePrice = item.promotional_price ?? item.price

  function toggleExtra(extra: Extra) {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra]
    )
  }

  const total = basePrice + selectedExtras.reduce((sum, e) => sum + e.price, 0)

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed inset-x-4 bottom-0 z-50 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {item.image_url && (
          <div className="relative h-44 sm:h-52 w-full">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
          </div>
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl tracking-wide">{item.name}</h3>
              <p className="text-white/50 text-sm mt-1 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-brand-600 font-bold">{formatCurrency(basePrice)}</span>
                {item.promotional_price && (
                  <span className="text-white/30 text-sm line-through">{formatCurrency(item.price)}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white transition-colors shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {Array.isArray(item.extras) && item.extras.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-white/70 mb-2">Adicionais</p>
              <div className="space-y-2">
                {item.extras.map((extra) => {
                  const selected = selectedExtras.some((e) => e.name === extra.name)
                  return (
                    <button
                      key={extra.name}
                      onClick={() => toggleExtra(extra)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${
                        selected
                          ? 'border-brand-600 bg-brand-600/10 text-white'
                          : 'border-white/10 bg-surface-2 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span>{extra.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-500 font-medium">
                          +{formatCurrency(extra.price)}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            selected ? 'border-brand-600 bg-brand-600' : 'border-white/20'
                          }`}
                        >
                          {selected && (
                            <span className="text-white text-xs font-bold leading-none">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-white/70 mb-2">
              Observação <span className="font-normal text-white/40">(opcional)</span>
            </p>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: sem cebola, ponto da carne bem passado…"
              className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand-600 transition-colors resize-none h-20"
            />
          </div>

          <button
            onClick={() => onConfirm(selectedExtras, observation)}
            className="w-full flex items-center justify-between bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Adicionar ao pedido</span>
            <span className="font-display text-lg tracking-wider">{formatCurrency(total)}</span>
          </button>
        </div>
      </div>
    </>
  )
}
