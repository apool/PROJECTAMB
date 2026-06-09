import Link from 'next/link'
import { Instagram, Phone, MapPin, Clock, Flame } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-fire-gradient flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl tracking-widest">AMERICAN BURGUER</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Onde o sabor encontra a qualidade. Hambúrguer artesanal feito na brasa com ingredientes selecionados.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/american_burguercvv"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-white/60 hover:text-brand-600 hover:bg-surface-4 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5546988205566"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-white/60 hover:text-brand-600 hover:bg-surface-4 transition-all"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-xl tracking-wider mb-4 text-white">NAVEGAÇÃO</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/cardapio', label: 'Cardápio' },
                { href: '/#sobre', label: 'Sobre nós' },
                { href: '/#contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-brand-600 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xl tracking-wider mb-4 text-white">CONTATO</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <span>Coronel Vivida — PR</span>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Phone className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <a href="tel:+5546988205566" className="hover:text-brand-600 transition-colors">
                  (46) 98820-5566
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Clock className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p>Ter–Dom: 18h00 – 23h00</p>
                  <p>Segunda: Fechado</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} American Burguer. Todos os direitos reservados.</p>
          <p>Feito com 🔥 em Coronel Vivida</p>
        </div>
      </div>
    </footer>
  )
}
