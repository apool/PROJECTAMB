'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ApiResponse, Combo, ComboItem } from '@/types'

export type ComboInput = {
  name: string
  description: string
  price: number
  promotional_price: number | null
  image_url: string
  is_available: boolean
  position: number
  items: ComboItem[]
}

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
  return supabase
}

export async function listCombos(): Promise<Combo[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('combos')
    .select('*')
    .order('position')
  return (data as Combo[]) ?? []
}

export async function createCombo(input: ComboInput): Promise<ApiResponse<Combo>> {
  try {
    const supabase = await requireAuth()
    const { data, error } = await supabase
      .from('combos')
      .insert({
        name: input.name,
        description: input.description || null,
        price: input.price,
        promotional_price: input.promotional_price ?? null,
        image_url: input.image_url || null,
        is_available: input.is_available,
        position: input.position,
        items: input.items,
      })
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/cardapio')
    return { success: true, data: data as Combo }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro inesperado' }
  }
}

export async function updateCombo(id: string, input: ComboInput): Promise<ApiResponse<Combo>> {
  try {
    const supabase = await requireAuth()
    const { data, error } = await supabase
      .from('combos')
      .update({
        name: input.name,
        description: input.description || null,
        price: input.price,
        promotional_price: input.promotional_price ?? null,
        image_url: input.image_url || null,
        is_available: input.is_available,
        position: input.position,
        items: input.items,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/cardapio')
    return { success: true, data: data as Combo }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro inesperado' }
  }
}

export async function deleteCombo(id: string): Promise<ApiResponse<null>> {
  try {
    const supabase = await requireAuth()
    const { error } = await supabase.from('combos').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/cardapio')
    return { success: true, data: null }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro inesperado' }
  }
}

export async function toggleComboAvailability(id: string): Promise<ApiResponse<{ is_available: boolean }>> {
  try {
    const supabase = await requireAuth()
    const { data: current } = await supabase.from('combos').select('is_available').eq('id', id).single()
    if (!current) return { success: false, error: 'Combo não encontrado' }
    const { data, error } = await supabase
      .from('combos')
      .update({ is_available: !current.is_available })
      .eq('id', id)
      .select('is_available')
      .single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/cardapio')
    return { success: true, data }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro inesperado' }
  }
}
