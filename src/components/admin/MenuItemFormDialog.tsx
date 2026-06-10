'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2, Upload, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import { menuItemSchema, type MenuItemInput } from '@/validators/menu'
import { createMenuItem, updateMenuItem } from '@/actions/menu'
import { uploadMenuImage, listMenuImages } from '@/actions/upload'
import type { Category, MenuItem } from '@/types'

type Props = {
  item: MenuItem | null
  categories: Category[]
  onClose: () => void
  onSaved: (item: MenuItem) => void
}

export function MenuItemFormDialog({ item, categories, onClose, onSaved }: Props) {
  const isEditing = !!item
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [loadingImages, setLoadingImages] = useState(false)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      promotional_price: null,
      category_id: categories[0]?.id ?? '',
      image_url: '',
      is_available: true,
      is_featured: false,
      extras: [],
      position: 0,
    },
  })

  async function openPicker() {
    setShowPicker((prev) => {
      if (prev) return false
      return true
    })
    if (!showPicker && availableImages.length === 0) {
      setLoadingImages(true)
      try {
        const imgs = await listMenuImages()
        setAvailableImages(imgs)
      } catch {
        // silently ignore
      } finally {
        setLoadingImages(false)
      }
    }
  }

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description,
        price: item.price,
        promotional_price: item.promotional_price ?? null,
        category_id: item.category_id,
        image_url: item.image_url ?? '',
        is_available: item.is_available,
        is_featured: item.is_featured,
        extras: Array.isArray(item.extras) ? item.extras : [],
        position: item.position,
      })
    }
  }, [item, reset])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.set('file', file)
    const res = await uploadMenuImage(formData)
    if (res.success && res.url) {
      setValue('image_url', res.url)
      setAvailableImages((prev) => (prev.includes(res.url!) ? prev : [...prev, res.url!]))
    } else {
      alert(res.error ?? 'Erro ao fazer upload')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function onSubmit(data: MenuItemInput) {
    const res = isEditing
      ? await updateMenuItem(item.id, data)
      : await createMenuItem(data)

    if (!res.success) {
      alert(res.error ?? 'Erro ao salvar')
      return
    }
    onSaved(res.data as MenuItem)
  }

  const currentImage = watch('image_url')

  const inputClass =
    'w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-600 transition-colors placeholder-white/20'
  const labelClass = 'block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider'
  const errorClass = 'text-red-400 text-xs mt-1'

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-label={isEditing ? 'Editar item' : 'Novo item'}
          className="relative w-full max-w-xl bg-surface-2 border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-surface-2">
            <h2 className="font-display text-2xl tracking-wide">
              {isEditing ? 'EDITAR ITEM' : 'NOVO ITEM'}
            </h2>
            <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nome *</label>
                <input {...register('name')} className={inputClass} placeholder="Raiz e Brasa" />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Descrição *</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={inputClass + ' resize-none'}
                  placeholder="Ingredientes e descrição…"
                />
                {errors.description && <p className={errorClass}>{errors.description.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { valueAsNumber: true })}
                  className={inputClass}
                  placeholder="32.90"
                />
                {errors.price && <p className={errorClass}>{errors.price.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Preço Promocional (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('promotional_price', {
                    setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                  })}
                  className={inputClass}
                  placeholder="Ex: 27.90 (deixe vazio para remover)"
                />
                {errors.promotional_price && (
                  <p className={errorClass}>{errors.promotional_price.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Categoria *</label>
                <select {...register('category_id')} className={inputClass}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className={errorClass}>{errors.category_id.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Posição</label>
                <input
                  type="number"
                  min="0"
                  {...register('position', { valueAsNumber: true })}
                  className={inputClass}
                />
              </div>

              {/* Image section */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Imagem do produto</label>

                {currentImage && (
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3 border border-white/10">
                    <Image src={currentImage} alt="Preview" fill className="object-cover" />
                  </div>
                )}

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 bg-surface-3 hover:bg-white/10 rounded-xl text-sm text-white/70 border border-white/10 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Enviando…' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={openPicker}
                    className="flex items-center gap-2 px-3 py-2 bg-surface-3 hover:bg-white/10 rounded-xl text-sm text-white/70 border border-white/10 transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    {loadingImages ? 'Carregando…' : 'Escolher existente'}
                  </button>
                </div>

                {showPicker && (
                  <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto bg-[#0A0A0A] rounded-xl p-2 border border-white/10 mb-3">
                    {availableImages.map((imgUrl) => (
                      <button
                        key={imgUrl}
                        type="button"
                        onClick={() => { setValue('image_url', imgUrl); setShowPicker(false) }}
                        className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImage === imgUrl ? 'border-brand-600' : 'border-transparent hover:border-white/30'
                        }`}
                      >
                        <Image src={imgUrl} alt="" fill className="object-cover" />
                      </button>
                    ))}
                    {availableImages.length === 0 && (
                      <p className="col-span-5 text-center text-white/30 text-xs py-4">
                        Nenhuma imagem encontrada
                      </p>
                    )}
                  </div>
                )}

                <input
                  {...register('image_url')}
                  className={inputClass}
                  placeholder="/img/hamburger_1.jpg ou URL externa"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex flex-col gap-3 justify-end sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_available')}
                    className="w-4 h-4 rounded accent-brand-600"
                  />
                  <span className="text-sm text-white/70">Disponível</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="w-4 h-4 rounded accent-brand-600"
                  />
                  <span className="text-sm text-white/70">Destaque na home</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Criar item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
