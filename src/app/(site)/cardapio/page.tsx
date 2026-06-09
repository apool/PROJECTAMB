import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MenuGrid } from '@/components/menu/MenuGrid'
import type { Category, MenuItem } from '@/types'

export const metadata: Metadata = {
  title: 'Cardápio',
  description: 'Conheça nossos hambúrgueres artesanais feitos na brasa. Raiz e Brasa, Caramelizada, Exclusivo Duplo e muito mais!',
}

export const revalidate = 60 // ISR: revalidate every 60s

async function getData() {
  const supabase = await createClient()

  const [categoriesRes, itemsRes] = await Promise.all([
    supabase.from('categories').select('*').order('position'),
    supabase
      .from('menu_items')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .order('position'),
  ])

  return {
    categories: (categoriesRes.data as Category[]) ?? [],
    items: (itemsRes.data as MenuItem[]) ?? [],
  }
}

export default async function CardapioPage() {
  const { categories, items } = await getData()

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="relative py-20 overflow-hidden bg-surface">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #E8620A, transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-brand-600 text-sm font-medium mb-2">🍔 O QUE TEMOS HOJE</div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-wide">
            NOSSO CARDÁPIO
          </h1>
          <p className="text-white/50 mt-3 max-w-xl">
            Todos os burgers são artesanais, feitos na brasa com ingredientes frescos e selecionados.
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <MenuGrid categories={categories} items={items} />
      </div>
    </div>
  )
}
