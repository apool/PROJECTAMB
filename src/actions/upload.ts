'use server'

import { writeFile, readdir } from 'fs/promises'
import path from 'path'
import { createClient } from '@/lib/supabase/server'

export async function uploadMenuImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    const file = formData.get('file') as File
    if (!file || !file.size) return { success: false, error: 'Nenhum arquivo enviado' }

    const safeName = file.name.replace(/\s+/g, '-')
    const filePath = path.join(process.cwd(), 'public', 'img', safeName)
    const buffer = Buffer.from(await file.arrayBuffer())

    await writeFile(filePath, buffer)
    return { success: true, url: `/img/${safeName}` }
  } catch (err) {
    console.error('[uploadMenuImage]', err)
    return { success: false, error: 'Erro ao fazer upload' }
  }
}

export async function listMenuImages(): Promise<string[]> {
  try {
    const imgDir = path.join(process.cwd(), 'public', 'img')
    const files = await readdir(imgDir)
    return files
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .map((f) => `/img/${f}`)
  } catch {
    return []
  }
}
