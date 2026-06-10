import { createClient } from '@/lib/supabase/server'
import { MenuAdminClient } from '@/components/admin/MenuAdminClient'
import type { Category, MenuItem } from '@/types'

export default async function AdminMenuPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*').order('position'),
    supabase
      .from('menu_items')
      .select('*, category:categories(*)')
      .order('position'),
  ])

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide">CARDÁPIO</h1>
        <p className="text-white/40 text-sm mt-1">Gerencie os itens do cardápio</p>
      </div>
      <MenuAdminClient
        initialCategories={(categories as Category[]) ?? []}
        initialItems={(items as MenuItem[]) ?? []}
      />
    </div>
  )
}
