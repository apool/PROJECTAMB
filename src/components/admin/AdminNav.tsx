'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, UtensilsCrossed, ClipboardList, LogOut } from 'lucide-react'

const links = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/menu', icon: UtensilsCrossed, label: 'Cardápio' },
  { href: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
]

export function AdminNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-white/5 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <Image src="/img/logo.jpg" alt="American Burguer" width={28} height={28} className="object-cover w-full h-full" />
          </div>
          <span className="font-display text-sm tracking-widest">AMERICAN</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-2 text-white/60 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-surface border-r border-white/5 flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image src="/img/logo.jpg" alt="American Burguer" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-display text-sm tracking-widest">AMERICAN</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden p-1 text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ href, icon: Icon, label }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? 'bg-brand-600/10 text-brand-500 font-medium'
                    : 'text-white/70 hover:bg-surface-2 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/5">
          <p className="text-white/30 text-xs truncate mb-3">{email}</p>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm transition-colors">
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-white/5 flex">
        {links.map(({ href, icon: Icon, label }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors ${
                active ? 'text-brand-500' : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
