'use client'

import { MessageCircle } from 'lucide-react'
import { useCartContext } from './CartContext'

export function WhatsAppFAB() {
  const { count, whatsappUrl } = useCartContext()

  // If cart is empty, show generic WhatsApp link
  const href =
    count > 0
      ? whatsappUrl
      : 'https://wa.me/5546988205566?text=Ol%C3%A1!%20Quero%20fazer%20um%20pedido%20%F0%9F%94%A5'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 active:scale-95"
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold">
        {count > 0 ? `Pedir (${count})` : 'Pedir agora'}
      </span>
    </a>
  )
}
