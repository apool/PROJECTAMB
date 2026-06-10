'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { deleteCombo, toggleComboAvailability } from '@/actions/combos'
import { ComboFormDialog } from './ComboFormDialog'
import type { Combo, MenuItem } from '@/types'

type Props = {
  initialCombos: Combo[]
  menuItems: MenuItem[]
}

export function CombosAdminClient({ initialCombos, menuItems }: Props) {
  const [combos, setCombos] = useState(initialCombos)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null)

  function handleSaved(combo: Combo) {
    setCombos((prev) => {
      const exists = prev.find((c) => c.id === combo.id)
      if (exists) return prev.map((c) => (c.id === combo.id ? combo : c))
      return [...prev, combo]
    })
    setDialogOpen(false)
    setEditingCombo(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este combo?')) return
    const res = await deleteCombo(id)
    if (res.success) setCombos((prev) => prev.filter((c) => c.id !== id))
    else alert(res.error ?? 'Erro ao remover')
  }

  async function handleToggle(id: string) {
    const res = await toggleComboAvailability(id)
    if (res.success && res.data) {
      setCombos((prev) => prev.map((c) => c.id === id ? { ...c, is_available: res.data!.is_available } : c))
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4 sm:mb-6">
        <button
          onClick={() => { setEditingCombo(null); setDialogOpen(true) }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo combo
        </button>
      </div>

      {combos.length === 0 ? (
        <div className="text-center py-20 text-white/30 bg-surface-2 rounded-2xl border border-white/5">
          <p className="text-lg mb-2">Nenhum combo cadastrado</p>
          <p className="text-sm">Clique em &quot;Novo combo&quot; para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
              {combo.image_url ? (
                <div className="relative h-36 w-full">
                  <Image src={combo.image_url} alt={combo.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-20 bg-surface-3 flex items-center justify-center text-3xl">🍔</div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight">{combo.name}</h3>
                  <button onClick={() => handleToggle(combo.id)} title={combo.is_available ? 'Desativar' : 'Ativar'}>
                    {combo.is_available
                      ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  </button>
                </div>

                {combo.items.length > 0 && (
                  <div className="mb-3 space-y-0.5">
                    {combo.items.map((item, i) => (
                      <p key={i} className="text-xs text-white/40">
                        {item.quantity > 1 && <span className="text-brand-600 font-semibold">{item.quantity}× </span>}
                        {item.name}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    {combo.promotional_price ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-red-400">{formatCurrency(combo.promotional_price)}</span>
                        <span className="text-xs text-white/30 line-through">{formatCurrency(combo.price)}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-brand-600">{formatCurrency(combo.price)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingCombo(combo); setDialogOpen(true) }} className="p-1.5 text-white/40 hover:text-brand-600 transition-colors" aria-label="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(combo.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors" aria-label="Excluir">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogOpen && (
        <ComboFormDialog
          combo={editingCombo}
          menuItems={menuItems}
          onClose={() => { setDialogOpen(false); setEditingCombo(null) }}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
