'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Flame, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword(data)
    if (authError) {
      setError('E-mail ou senha incorretos.')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-fire-gradient flex items-center justify-center mx-auto mb-4 brand-glow">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl tracking-widest">AMERICAN BURGUER</h1>
          <p className="text-white/40 text-sm mt-1">Painel Administrativo</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2 border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-600 transition-colors"
              placeholder="admin@americanburguer.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-600 transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
