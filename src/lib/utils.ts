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

export function buildWhatsAppMessage(
  items: CartItem[],
  phone: string = '5546988205566'
): string {
  const lines: string[] = ['🍔 *Pedido - American Burguer*\n']

  items.forEach((item, index) => {
    lines.push(
      `*${index + 1}. ${item.menuItem.name}* x${item.quantity}`
    )
    lines.push(`   💰 ${formatCurrency(item.menuItem.price * item.quantity)}`)

    if (item.extras.length > 0) {
      const extraNames = item.extras.map((e: Extra) => e.name).join(', ')
      lines.push(`   ➕ Adicionais: ${extraNames}`)
    }

    if (item.observation) {
      lines.push(`   📝 Obs: ${item.observation}`)
    }
  })

  const total = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  )

  lines.push(`\n💳 *Total: ${formatCurrency(total)}*`)
  lines.push('\n📍 Coronel Vivida — Aguardando endereço para entrega')

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${phone}?text=${message}`
}

export function getItemTotal(item: CartItem): number {
  const extrasTotal = item.extras.reduce((sum: number, e: Extra) => sum + e.price, 0)
  return (item.menuItem.price + extrasTotal) * item.quantity
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0)
}
