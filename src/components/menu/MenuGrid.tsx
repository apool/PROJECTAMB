'use client'

import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { MenuCard } from './MenuCard'
import type { Category, MenuItem } from '@/types'

type Props = {
  categories: Category[]
  items: MenuItem[]
}

export function MenuGrid({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category?.slug === activeCategory)

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          Nenhum item disponível nessa categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
