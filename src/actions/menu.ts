'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { menuItemSchema, type MenuItemInput } from '@/validators/menu'
import type { ApiResponse, MenuItem } from '@/types'

export async function createMenuItem(
  input: MenuItemInput
): Promise<ApiResponse<MenuItem>> {
  try {
    const parsed = menuItemSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        ...parsed.data,
        image_url: parsed.data.image_url || null,
        extras: parsed.data.extras?.length ? parsed.data.extras : null,
      })
      .select('*, category:categories(*)')
      .single()

    if (error) {
      console.error('[createMenuItem]', error)
      return { success: false, error: 'Erro ao criar item' }
    }

    revalidatePath('/cardapio')
    revalidatePath('/')
    return { success: true, data: data as MenuItem }
  } catch (err) {
    console.error('[createMenuItem]', err)
    return { success: false, error: 'Erro inesperado' }
  }
}

export async function updateMenuItem(
  id: string,
  input: MenuItemInput
): Promise<ApiResponse<MenuItem>> {
  try {
    const parsed = menuItemSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    const { data, error } = await supabase
      .from('menu_items')
      .update({
        ...parsed.data,
        image_url: parsed.data.image_url || null,
        extras: parsed.data.extras?.length ? parsed.data.extras : null,
      })
      .eq('id', id)
      .select('*, category:categories(*)')
      .single()

    if (error) {
      console.error('[updateMenuItem]', error)
      return { success: false, error: 'Erro ao atualizar item' }
    }

    revalidatePath('/cardapio')
    revalidatePath('/')
    return { success: true, data: data as MenuItem }
  } catch (err) {
    console.error('[updateMenuItem]', err)
    return { success: false, error: 'Erro inesperado' }
  }
}

export async function deleteMenuItem(id: string): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[deleteMenuItem]', error)
      return { success: false, error: 'Erro ao remover item' }
    }

    revalidatePath('/cardapio')
    revalidatePath('/')
    return { success: true, data: null }
  } catch (err) {
    console.error('[deleteMenuItem]', err)
    return { success: false, error: 'Erro inesperado' }
  }
}

export async function toggleAvailability(
  id: string
): Promise<ApiResponse<{ is_available: boolean }>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    const { data: current } = await supabase
      .from('menu_items')
      .select('is_available')
      .eq('id', id)
      .single()

    if (!current) return { success: false, error: 'Item não encontrado' }

    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: !current.is_available })
      .eq('id', id)
      .select('is_available')
      .single()

    if (error) return { success: false, error: 'Erro ao atualizar' }

    revalidatePath('/cardapio')
    return { success: true, data }
  } catch (err) {
    console.error('[toggleAvailability]', err)
    return { success: false, error: 'Erro inesperado' }
  }
}
