'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, CheckCircle, XCircle, Search } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { MenuItemFormDialog } from './MenuItemFormDialog'
import { deleteMenuItem, toggleAvailability } from '@/actions/menu'
import type { Category, MenuItem } from '@/types'

type Props = {
  initialCategories: Category[]
  initialItems: MenuItem[]
}

export function MenuAdminClient({ initialCategories, initialItems }: Props) {
  const [items, setItems] = useState(initialItems)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'all' || item.category_id === filterCategory
    return matchSearch && matchCat
  })

  function handleSaved(item: MenuItem) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) return prev.map((i) => (i.id === item.id ? item : i))
      return [...prev, item]
    })
    setDialogOpen(false)
    setEditingItem(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este item do cardápio?')) return
    const res = await deleteMenuItem(id)
    if (res.success) setItems((prev) => prev.filter((i) => i.id !== id))
    else alert(res.error ?? 'Erro ao remover')
  }

  async function handleToggle(id: string) {
    const res = await toggleAvailability(id)
    if (res.success && res.data) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_available: res.data!.is_available } : i))
      )
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar item…"
            className="w-full bg-surface-2 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-600 transition-colors"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-surface-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 transition-colors"
        >
          <option value="all">Todas categorias</option>
          {initialCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => { setEditingItem(null); setDialogOpen(true) }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo item
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">Item</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">Categoria</th>
                <th className="text-right px-5 py-3.5 font-medium">Preço</th>
                <th className="text-center px-5 py-3.5 font-medium">Status</th>
                <th className="text-right px-5 py-3.5 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/30">
                    Nenhum item encontrado
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover w-10 h-10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center text-lg">
                            🍔
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 font-medium">
                            {item.name}
                            {item.is_featured && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                          </div>
                          <p className="text-white/30 text-xs truncate max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-white/50">
                      {item.category?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-brand-600">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleToggle(item.id)}
                        className="inline-flex items-center gap-1 text-xs transition-colors"
                        title={item.is_available ? 'Clique para desativar' : 'Clique para ativar'}
                      >
                        {item.is_available ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingItem(item); setDialogOpen(true) }}
                          className="p-1.5 text-white/40 hover:text-brand-600 transition-colors"
                          aria-label={`Editar ${item.name}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                          aria-label={`Excluir ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <MenuItemFormDialog
          item={editingItem}
          categories={initialCategories}
          onClose={() => { setDialogOpen(false); setEditingItem(null) }}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
