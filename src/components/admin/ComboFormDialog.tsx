'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, Upload, LayoutGrid, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { listMenuImages, uploadMenuImage } from '@/actions/upload'
import { createCombo, updateCombo } from '@/actions/combos'
import type { Combo, ComboItem, MenuItem } from '@/types'
import { formatCurrency } from '@/lib/utils'

type Props = {
  combo: Combo | null
  menuItems: MenuItem[]
  onClose: () => void
  onSaved: (combo: Combo) => void
}

const inputClass = 'w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-600 transition-colors placeholder-white/20'
const labelClass = 'block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider'

export function ComboFormDialog({ combo, menuItems, onClose, onSaved }: Props) {
  const isEditing = !!combo
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(combo?.name ?? '')
  const [description, setDescription] = useState(combo?.description ?? '')
  const [price, setPrice] = useState(combo?.price ?? 0)
  const [promoPrice, setPromoPrice] = useState<number | ''>(combo?.promotional_price ?? '')
  const [imageUrl, setImageUrl] = useState(combo?.image_url ?? '')
  const [isAvailable, setIsAvailable] = useState(combo?.is_available ?? true)
  const [position, setPosition] = useState(combo?.position ?? 0)
  const [selectedItems, setSelectedItems] = useState<ComboItem[]>(combo?.items ?? [])

  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [loadingImages, setLoadingImages] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (combo) {
      setName(combo.name)
      setDescription(combo.description ?? '')
      setPrice(combo.price)
      setPromoPrice(combo.promotional_price ?? '')
      setImageUrl(combo.image_url ?? '')
      setIsAvailable(combo.is_available)
      setPosition(combo.position)
      setSelectedItems(combo.items)
    }
  }, [combo])

  async function openPicker() {
    setShowPicker((v) => !v)
    if (!showPicker && availableImages.length === 0) {
      setLoadingImages(true)
      try { setAvailableImages(await listMenuImages()) } catch { /* ignore */ }
      finally { setLoadingImages(false) }
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.set('file', file)
    const res = await uploadMenuImage(formData)
    if (res.success && res.url) setImageUrl(res.url)
    else alert(res.error ?? 'Erro ao fazer upload')
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function toggleItem(item: MenuItem) {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.menu_item_id === item.id)
      if (exists) return prev.filter((i) => i.menu_item_id !== item.id)
      return [...prev, { menu_item_id: item.id, name: item.name, quantity: 1 }]
    })
  }

  function setItemQty(menu_item_id: string, qty: number) {
    if (qty <= 0) {
      setSelectedItems((prev) => prev.filter((i) => i.menu_item_id !== menu_item_id))
      return
    }
    setSelectedItems((prev) =>
      prev.map((i) => i.menu_item_id === menu_item_id ? { ...i, quantity: qty } : i)
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || price <= 0) return
    setSubmitting(true)

    const input = {
      name: name.trim(),
      description: description.trim(),
      price,
      promotional_price: promoPrice === '' ? null : Number(promoPrice),
      image_url: imageUrl,
      is_available: isAvailable,
      position,
      items: selectedItems,
    }

    const res = isEditing ? await updateCombo(combo.id, input) : await createCombo(input)
    if (!res.success) { alert(res.error ?? 'Erro ao salvar'); setSubmitting(false); return }
    onSaved(res.data as Combo)
  }

  const categorized = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category?.name ?? 'Sem categoria'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          className="relative w-full max-w-2xl bg-surface-2 border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-surface-2 z-10">
            <h2 className="font-display text-2xl tracking-wide">
              {isEditing ? 'EDITAR COMBO' : 'NOVO COMBO'}
            </h2>
            <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Nome do combo *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} placeholder="Combo Família" />
              </div>

              {/* Descrição */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Descrição</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass + ' resize-none'} placeholder="Descrição do combo…" />
              </div>

              {/* Preço */}
              <div>
                <label className={labelClass}>Preço (R$) *</label>
                <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className={inputClass} placeholder="49.90" />
              </div>

              {/* Preço Promocional */}
              <div>
                <label className={labelClass}>Preço Promocional (R$)</label>
                <input type="number" step="0.01" min="0" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} placeholder="Ex: 44.90 (opcional)" />
              </div>

              {/* Posição */}
              <div>
                <label className={labelClass}>Posição</label>
                <input type="number" min="0" value={position} onChange={(e) => setPosition(Number(e.target.value))} className={inputClass} />
              </div>

              {/* Disponível */}
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
                  <span className="text-sm text-white/70">Disponível no cardápio</span>
                </label>
              </div>

              {/* Imagem */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Imagem do combo</label>
                {imageUrl && (
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3 border border-white/10">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-3 py-2 bg-surface-3 hover:bg-white/10 rounded-xl text-sm text-white/70 border border-white/10 transition-colors disabled:opacity-50">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Enviando…' : 'Upload'}
                  </button>
                  <button type="button" onClick={openPicker} className="flex items-center gap-2 px-3 py-2 bg-surface-3 hover:bg-white/10 rounded-xl text-sm text-white/70 border border-white/10 transition-colors">
                    <LayoutGrid className="w-4 h-4" />
                    {loadingImages ? 'Carregando…' : 'Escolher existente'}
                  </button>
                </div>
                {showPicker && (
                  <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto bg-[#0A0A0A] rounded-xl p-2 border border-white/10 mb-3">
                    {availableImages.map((img) => (
                      <button key={img} type="button" onClick={() => { setImageUrl(img); setShowPicker(false) }} className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${imageUrl === img ? 'border-brand-600' : 'border-transparent hover:border-white/30'}`}>
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                    {availableImages.length === 0 && <p className="col-span-5 text-center text-white/30 text-xs py-4">Nenhuma imagem</p>}
                  </div>
                )}
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="/img/combo.jpg ou URL externa" />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            {/* Seleção de itens */}
            <div>
              <p className={labelClass}>Itens incluídos no combo</p>

              {selectedItems.length > 0 && (
                <div className="bg-brand-600/5 border border-brand-600/20 rounded-xl p-3 mb-3 space-y-2">
                  {selectedItems.map((si) => (
                    <div key={si.menu_item_id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-white/80 flex-1 truncate">{si.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => setItemQty(si.menu_item_id, si.quantity - 1)} className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{si.quantity}</span>
                        <button type="button" onClick={() => setItemQty(si.menu_item_id, si.quantity + 1)} className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center hover:bg-brand-600/30 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                {Object.entries(categorized).map(([cat, catItems]) => (
                  <div key={cat}>
                    <p className="px-4 py-2 text-xs font-semibold text-white/30 uppercase tracking-wider bg-white/2 border-b border-white/5">{cat}</p>
                    {catItems.map((item) => {
                      const checked = selectedItems.some((s) => s.menu_item_id === item.id)
                      return (
                        <label key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0">
                          <input type="checkbox" checked={checked} onChange={() => toggleItem(item)} className="w-4 h-4 accent-brand-600 shrink-0" />
                          <span className="text-sm flex-1">{item.name}</span>
                          <span className="text-xs text-white/30 shrink-0">{formatCurrency(item.promotional_price ?? item.price)}</span>
                        </label>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Criar combo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
