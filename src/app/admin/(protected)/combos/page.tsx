import { createClient } from '@/lib/supabase/server'
import { CombosAdminClient } from '@/components/admin/CombosAdminClient'
import type { Combo, MenuItem } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminCombosPage() {
  const supabase = await createClient()

  const [{ data: combos }, { data: menuItems }] = await Promise.all([
    supabase.from('combos').select('*').order('position'),
    supabase.from('menu_items').select('*, category:categories(*)').eq('is_available', true).order('position'),
  ])

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide">COMBOS</h1>
        <p className="text-white/40 text-sm mt-1">Monte combos com itens do cardápio</p>
      </div>
      <CombosAdminClient
        initialCombos={(combos as Combo[]) ?? []}
        menuItems={(menuItems as MenuItem[]) ?? []}
      />
    </div>
  )
}
