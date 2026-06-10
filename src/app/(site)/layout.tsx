import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { CartProvider } from '@/components/shared/CartContext'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </CartProvider>
  )
}
