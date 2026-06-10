import { createClient } from '@/lib/supabase/server'
import { OrdersAdminClient } from '@/components/admin/OrdersAdminClient'
import type { Order } from '@/actions/orders'

export const dynamic = 'force-dynamic'

export default async function PedidosPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayCount = (orders ?? []).filter(
    (o) => new Date(o.created_at) >= todayStart
  ).length

  return (
    <OrdersAdminClient
      initialOrders={(orders ?? []) as Order[]}
      todayCount={todayCount}
    />
  )
}
