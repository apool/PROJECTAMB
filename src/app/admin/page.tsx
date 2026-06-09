import { createClient } from '@/lib/supabase/server'
import { UtensilsCrossed, CheckCircle, XCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ count: total }, { count: available }, { count: featured }] = await Promise.all([
    supabase.from('menu_items').select('*', { count: 'exact', head: true }),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_featured', true),
  ])

  const stats = [
    { label: 'Total de itens', value: total ?? 0, icon: UtensilsCrossed, color: 'text-brand-600' },
    { label: 'Disponíveis', value: available ?? 0, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Indisponíveis', value: (total ?? 0) - (available ?? 0), icon: XCircle, color: 'text-red-400' },
    { label: 'Destaques', value: featured ?? 0, icon: Star, color: 'text-yellow-400' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide">DASHBOARD</h1>
        <p className="text-white/40 text-sm mt-1">Visão geral do cardápio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-2 border border-white/5 rounded-2xl p-5">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <p className="font-display text-3xl tracking-wider">{stat.value}</p>
            <p className="text-white/40 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6">
        <h2 className="font-display text-2xl tracking-wide mb-4">AÇÕES RÁPIDAS</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Gerenciar Cardápio
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 bg-surface-3 hover:bg-surface-4 text-white/70 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all border border-white/5"
          >
            Ver site público ↗
          </Link>
        </div>
      </div>
    </div>
  )
}
