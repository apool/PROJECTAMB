'use client'

import { cn } from '@/lib/utils'
import type { Category } from '@/types'

type Props = {
  categories: Category[]
  active: string
  onChange: (slug: string) => void
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  const specials = [
    { id: 'destaque', name: 'Destaque', slug: 'destaque', description: null, position: -3, created_at: '' },
    { id: 'combos', name: '🍔 Combos', slug: 'combos', description: null, position: -2, created_at: '' },
    { id: 'promo', name: 'Promoção', slug: 'promo', description: null, position: -1, created_at: '' },
  ]
  const items = [...specials, ...categories]

  return (
    <div
      role="tablist"
      aria-label="Categorias do cardápio"
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x"
    >
      {items.map((cat) => (
        <button
          key={cat.slug}
          role="tab"
          aria-selected={active === cat.slug}
          onClick={() => onChange(cat.slug)}
          className={cn(
            'snap-start shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all',
            active === cat.slug
              ? 'bg-brand-600 text-white shadow-md shadow-brand-900/40'
              : 'bg-surface-2 text-white/60 hover:bg-surface-3 hover:text-white border border-white/5'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
