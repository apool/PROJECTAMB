'use server'

import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types'
import type { CustomerData } from '@/lib/utils'
import { getCartTotal, getItemTotal } from '@/lib/utils'

export type OrderInput = {
  customer: CustomerData
  items: CartItem[]
}

export async function saveOrder(input: OrderInput) {
  const supabase = await createClient()
  const total = getCartTotal(input.items)

  const orderItems = input.items.map((item) => ({
    name: item.menuItem.name,
    price: item.menuItem.promotional_price ?? item.menuItem.price,
    quantity: item.quantity,
    item_total: getItemTotal(item),
    extras: item.extras.map((e) => ({ name: e.name, price: e.price })),
    observation: item.observation || null,
  }))

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: input.customer.name,
      customer_cpf: input.customer.cpf || null,
      customer_phone: input.customer.phone,
      delivery_type: input.customer.deliveryType,
      address: input.customer.address || null,
      items: orderItems,
      total,
    })
    .select('id, order_number')
    .single()

  if (error) return { success: false as const, error: error.message }
  return { success: true as const, data }
}

export type Order = {
  id: string
  order_number: number
  customer_name: string
  customer_cpf: string | null
  customer_phone: string
  delivery_type: 'delivery' | 'pickup'
  address: string | null
  items: OrderItem[]
  total: number
  created_at: string
}

export type OrderItem = {
  name: string
  price: number
  quantity: number
  item_total: number
  extras: { name: string; price: number }[]
  observation: string | null
}
