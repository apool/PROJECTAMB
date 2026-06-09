import { z } from 'zod'

export const extraSchema = z.object({
  name: z.string().min(1, 'Nome do adicional obrigatório'),
  price: z.number().min(0, 'Preço deve ser positivo'),
})

export const menuItemSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição muito longa'),
  price: z
    .number({ invalid_type_error: 'Preço inválido' })
    .min(0.01, 'Preço deve ser maior que zero'),
  category_id: z.string().uuid('Categoria inválida'),
  image_url: z.string().url('URL inválida').optional().nullable(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  extras: z.array(extraSchema).optional().default([]),
  position: z.number().int().min(0).default(0),
})

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo'),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .max(50, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().max(200).optional().nullable(),
  position: z.number().int().min(0).default(0),
})

export const orderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  extras: z.array(extraSchema).optional().default([]),
  observation: z.string().max(300).optional().default(''),
})

export type MenuItemInput = z.infer<typeof menuItemSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
