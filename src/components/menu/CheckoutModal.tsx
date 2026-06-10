'use client'

import { useState } from 'react'
import { X, ChevronRight, Loader2 } from 'lucide-react'
import { useCartContext } from '../shared/CartContext'
import { buildWhatsAppMessage, formatCurrency, getItemTotal, DELIVERY_FEE } from '@/lib/utils'
import type { CustomerData } from '@/lib/utils'
import { saveOrder } from '@/actions/orders'

type Props = {
  onClose: () => void
  onSuccess?: () => void
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

const inputClass =
  'w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-600 transition-colors'

const labelClass =
  'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'

export function CheckoutModal({ onClose, onSuccess }: Props) {
  const { items, total, clearCart } = useCartContext()

  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [complemento, setComplemento] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const deliveryFee = deliveryType === 'delivery' ? DELIVERY_FEE : 0
  const grandTotal = total + deliveryFee

  const addressValid =
    deliveryType === 'pickup' ||
    (rua.trim().length > 0 && numero.trim().length > 0 && bairro.trim().length > 0)

  const isValid =
    name.trim().length > 0 &&
    cpf.trim().length === 14 &&
    phone.trim().length >= 14 &&
    addressValid

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)

    const fullAddress =
      deliveryType === 'delivery'
        ? [
            `${rua.trim()}, ${numero.trim()}`,
            bairro.trim(),
            complemento.trim() || null,
          ]
            .filter(Boolean)
            .join(' — ')
        : undefined

    const customer: CustomerData = {
      name: name.trim(),
      cpf: cpf.trim(),
      phone: phone.trim(),
      deliveryType,
      address: fullAddress,
    }

    const url = buildWhatsAppMessage(items, customer)

    await saveOrder({ customer, items })

    window.location.href = url
    clearCart()
    onSuccess?.()
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-x-4 bottom-0 z-[60] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-2xl tracking-wider">FINALIZAR PEDIDO</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Nome */}
          <div>
            <label className={labelClass}>Nome completo *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="João da Silva"
              className={inputClass}
            />
          </div>

          {/* CPF */}
          <div>
            <label className={labelClass}>CPF *</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              required
              placeholder="000.000.000-00"
              className={inputClass}
            />
          </div>

          {/* Telefone */}
          <div>
            <label className={labelClass}>Telefone / WhatsApp *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
              placeholder="(46) 99999-9999"
              className={inputClass}
            />
          </div>

          {/* Tipo de pedido */}
          <div>
            <p className={labelClass}>Tipo de pedido *</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-3.5 rounded-xl text-sm font-semibold border transition-all flex flex-col items-center gap-0.5 ${
                  deliveryType === 'delivery'
                    ? 'border-brand-600 bg-brand-600/10 text-white'
                    : 'border-white/10 bg-surface-2 text-white/50 hover:border-white/20'
                }`}
              >
                <span>🏠 Entrega</span>
                <span className={`text-xs font-normal ${deliveryType === 'delivery' ? 'text-brand-500' : 'text-white/30'}`}>
                  +{formatCurrency(DELIVERY_FEE)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-3.5 rounded-xl text-sm font-semibold border transition-all flex flex-col items-center gap-0.5 ${
                  deliveryType === 'pickup'
                    ? 'border-brand-600 bg-brand-600/10 text-white'
                    : 'border-white/10 bg-surface-2 text-white/50 hover:border-white/20'
                }`}
              >
                <span>🏃 Retirada</span>
                <span className={`text-xs font-normal ${deliveryType === 'pickup' ? 'text-green-400' : 'text-white/30'}`}>
                  Grátis
                </span>
              </button>
            </div>
          </div>

          {/* Endereço detalhado (só para entrega) */}
          {deliveryType === 'delivery' && (
            <div className="space-y-3">
              <p className={labelClass}>Endereço de entrega *</p>

              <div>
                <label className="block text-xs text-white/40 mb-1">Rua *</label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  required
                  placeholder="Rua das Flores"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Número *</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                    placeholder="123"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Bairro *</label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    required
                    placeholder="Centro"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">
                  Complemento <span className="text-white/20">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Apto 12, Casa dos fundos…"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Itens + Resumo do total */}
          <div className="bg-surface-2 rounded-xl border border-white/5 overflow-hidden text-sm">
            <p className="px-4 pt-3 pb-1 text-xs font-semibold text-white/40 uppercase tracking-wider">
              Itens do pedido
            </p>
            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-2.5 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.quantity > 1 && (
                        <span className="text-brand-600 font-bold mr-1">{item.quantity}×</span>
                      )}
                      {item.menuItem.name}
                    </p>
                    {item.extras.length > 0 && (
                      <p className="text-xs text-white/30 truncate">
                        + {item.extras.map((e) => e.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-brand-600 shrink-0">
                    {formatCurrency(getItemTotal(item))}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Taxa de entrega</span>
                <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                  {deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1.5 border-t border-white/10">
                <span>Total</span>
                <span className="text-brand-600 font-display text-lg tracking-wide">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full flex items-center justify-between bg-[#25D366] hover:bg-[#1fba58] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando…
              </span>
            ) : (
              <span>Enviar pelo WhatsApp</span>
            )}
            <div className="flex items-center gap-1">
              <span className="font-display text-lg tracking-wider">{formatCurrency(grandTotal)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </form>
      </div>
    </>
  )
}
