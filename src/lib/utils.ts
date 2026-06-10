import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CartItem, Extra } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export const DELIVERY_FEE = 8

export type CustomerData = {
  name: string
  cpf: string
  phone: string
  deliveryType: 'delivery' | 'pickup'
  address?: string
}

export function buildWhatsAppMessage(
  items: CartItem[],
  customer?: CustomerData,
  businessPhone: string = '5546999321609'
): string {
  const lines: string[] = ['🍔 *Pedido - American Burguer*\n']

  if (customer) {
    lines.push(`👤 *Cliente:* ${customer.name}`)
    lines.push(`📋 *CPF:* ${customer.cpf}`)
    lines.push(`📱 *Telefone:* ${customer.phone}`)
    if (customer.deliveryType === 'delivery') {
      lines.push(`🏠 *Tipo:* Entrega (+${formatCurrency(DELIVERY_FEE)})`)
      if (customer.address) lines.push(`📍 *Endereço:* ${customer.address}`)
      else lines.push(`📍 *Endereço:* Não informado`)
    } else {
      lines.push(`🏃 *Tipo:* Retirada no local (Grátis)`)
    }
    lines.push('')
  }

  items.forEach((item, index) => {
    lines.push(`*${index + 1}. ${item.menuItem.name}* x${item.quantity}`)
    lines.push(`   💰 ${formatCurrency(getItemTotal(item))}`)
    if (item.extras.length > 0) {
      const extraNames = item.extras.map((e: Extra) => e.name).join(', ')
      lines.push(`   ➕ Adicionais: ${extraNames}`)
    }
    if (item.observation) {
      lines.push(`   📝 Obs: ${item.observation}`)
    }
  })

  const cartTotal = getCartTotal(items)
  const deliveryFee = customer?.deliveryType === 'delivery' ? DELIVERY_FEE : 0
  const grandTotal = cartTotal + deliveryFee

  lines.push(`\n🛒 *Subtotal: ${formatCurrency(cartTotal)}*`)
  if (deliveryFee > 0) lines.push(`🛵 *Taxa de entrega: ${formatCurrency(deliveryFee)}*`)
  lines.push(`💳 *Total: ${formatCurrency(grandTotal)}*`)

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${businessPhone}?text=${message}`
}

export function getItemTotal(item: CartItem): number {
  const basePrice = item.menuItem.promotional_price ?? item.menuItem.price
  const extrasTotal = item.extras.reduce((sum: number, e: Extra) => sum + e.price, 0)
  return (basePrice + extrasTotal) * item.quantity
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0)
}
