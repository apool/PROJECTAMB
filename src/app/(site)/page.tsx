import Link from 'next/link'
import { Flame, ChevronRight, Star, Clock, MapPin, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MenuCard } from '@/components/menu/MenuCard'
import type { MenuItem } from '@/types'

async function getFeaturedItems(): Promise<MenuItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('position')
    .limit(3)
  return (data as MenuItem[]) ?? []
}

export default async function HomePage() {
  const featured = await getFeaturedItems()

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/60 via-transparent to-transparent" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #E8620A 0%, transparent 60%)`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 text-brand-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Flame className="w-4 h-4" />
            Hambúrguer artesanal feito na brasa
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none tracking-wide">
            ONDE O SABOR
            <br />
            <span className="text-transparent bg-clip-text bg-fire-gradient">
              ENCONTRA
            </span>
            <br />
            A QUALIDADE
          </h1>

          <p className="mt-6 text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Ingredientes frescos, hambúrguer artesanal na brasa e entrega rápida em{' '}
            <span className="text-white font-medium">Coronel Vivida</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              href="/cardapio"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-900/50 brand-glow text-lg"
            >
              Ver Cardápio
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/5546988205566?text=Ol%C3%A1!%20Quero%20fazer%20um%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/10 text-lg"
            >
              Pedir agora
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 text-center">
            {[
              { value: '100%', label: 'Artesanal' },
              { value: 'Na Brasa', label: 'Grelhado' },
              { value: 'Delivery', label: 'Coronel Vivida' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-brand-600 tracking-wider">{stat.value}</p>
                <p className="text-white/40 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20 text-xs animate-bounce">
          <span>Role para baixo</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      {featured.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-brand-600 text-sm font-medium mb-2">
                <Star className="w-4 h-4 fill-brand-600" />
                DESTAQUES
              </div>
              <h2 className="font-display text-4xl sm:text-5xl tracking-wide">
                OS FAVORITOS
              </h2>
            </div>
            <Link
              href="/cardapio"
              className="hidden sm:flex items-center gap-1 text-brand-600 hover:text-brand-500 text-sm font-medium transition-colors"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 text-brand-600 font-medium"
            >
              Ver cardápio completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── SOBRE ─── */}
      <section id="sobre" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-brand-600 text-sm font-medium mb-2">SOBRE NÓS</div>
              <h2 className="font-display text-4xl sm:text-5xl tracking-wide mb-6">
                FEITO COM PAIXÃO,
                <br />
                <span className="text-brand-600">GRELHADO NA BRASA</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                A American Burguer nasceu da paixão por hambúrgueres de verdade. Cada burguer é feito
                à mão com ingredientes frescos e grelhado na brasa para garantir aquele sabor
                inconfundível de defumado.
              </p>
              <p className="text-white/60 leading-relaxed">
                Estamos em Coronel Vivida — PR, entregando não só um lanche, mas uma experiência
                gastronômica completa.
              </p>
              <Link
                href="/cardapio"
                className="inline-flex items-center gap-2 mt-8 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
              >
                Explorar cardápio <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🔥', title: 'Na Brasa', desc: 'Grelhado no carvão para sabor autêntico' },
                { icon: '🥩', title: 'Artesanal', desc: 'Cada hambúrguer moldado à mão' },
                { icon: '🌿', title: 'Fresquinho', desc: 'Ingredientes selecionados diariamente' },
                { icon: '🛵', title: 'Delivery', desc: 'Entrega rápida em Coronel Vivida' },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-surface-2 border border-white/5 rounded-2xl p-5 hover:border-brand-600/20 transition-colors"
                >
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="font-display text-xl tracking-wide mt-3 mb-1">{card.title}</h3>
                  <p className="text-white/40 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <section id="contato" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-wide mb-4">
            FAÇA SEU PEDIDO
          </h2>
          <p className="text-white/50 mb-10">
            Atendemos pelo WhatsApp. É só chamar, montar seu pedido e aguardar!
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: <Clock className="w-5 h-5" />, title: 'Horário', desc: 'Ter–Dom: 18h–23h' },
              { icon: <MapPin className="w-5 h-5" />, title: 'Local', desc: 'Coronel Vivida, PR' },
              { icon: <Phone className="w-5 h-5" />, title: 'Contato', desc: '(46) 98820-5566' },
            ].map((info) => (
              <div key={info.title} className="bg-surface-2 rounded-2xl p-5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-600/10 text-brand-600 flex items-center justify-center mx-auto mb-3">
                  {info.icon}
                </div>
                <p className="font-semibold text-sm">{info.title}</p>
                <p className="text-white/40 text-sm mt-1">{info.desc}</p>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/5546988205566?text=Ol%C3%A1!%20Quero%20fazer%20um%20pedido%20%F0%9F%94%A5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1fba58] text-white font-bold px-10 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#25D366]/20 text-lg"
          >
            <span className="text-2xl">💬</span>
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
