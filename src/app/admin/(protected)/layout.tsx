import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, UtensilsCrossed, LogOut, ClipboardList } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image src="/img/logo.jpg" alt="American Burguer" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-display text-sm tracking-widest">AMERICAN</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-surface-2 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-surface-2 hover:text-white transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Cardápio
          </Link>
          <Link
            href="/admin/pedidos"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-surface-2 hover:text-white transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Pedidos
          </Link>
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/5">
          <p className="text-white/30 text-xs truncate mb-3">{user.email}</p>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
