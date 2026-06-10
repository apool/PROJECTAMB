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

// Imagens estáticas disponíveis na pasta /public/img
const STATIC_IMAGES = [
  '/img/hamburger_1.jpg',
  '/img/hamburger_2.jpg',
  '/img/hamburger_3.jpg',
  '/img/hamburger_5.jpg',
  '/img/hamburger_6.jpg',
  '/img/hamburger_7.jpg',
  '/img/hamburger_9.jpg',
  '/img/Batata Bacon & Cheddar.webp',
  '/img/batata.jpg',
  '/img/Onion Rings2.jpg',
  '/img/Cocacola.png',
  '/img/agua mineral.jpg',
  '/img/suco.jpg',
]

export async function listMenuImages(): Promise<string[]> {
  try {
    // Em desenvolvimento lê dinamicamente do filesystem
    const imgDir = path.join(process.cwd(), 'public', 'img')
    const files = await readdir(imgDir)
    const dynamic = files
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .map((f) => `/img/${f}`)
    return dynamic.length > 0 ? dynamic : STATIC_IMAGES
  } catch {
    // Em produção (Vercel) o filesystem é somente leitura — usa lista estática
    return STATIC_IMAGES
  }
}
