'use client'

import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { MenuCard } from './MenuCard'
import { ComboCard } from './ComboCard'
import type { Category, Combo, MenuItem } from '@/types'

type Props = {
  categories: Category[]
  items: MenuItem[]
  combos: Combo[]
}

export function MenuGrid({ categories, items, combos }: Props) {
  const [activeCategory, setActiveCategory] = useState('destaque')

  const filteredItems =
    activeCategory === 'destaque'
      ? items.filter((i) => i.is_featured)
      : activeCategory === 'promo'
      ? items.filter((i) => i.promotional_price != null)
      : activeCategory === 'combos'
      ? []
      : items.filter((i) => i.category?.slug === activeCategory)

  const showCombos = activeCategory === 'combos'
  const isEmpty = showCombos ? combos.length === 0 : filteredItems.length === 0

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {isEmpty ? (
        <div className="text-center py-16 text-white/30">
          Nenhum item disponível nessa categoria.
        </div>
      ) : showCombos ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
