'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import type { Order } from '@/actions/orders'

type Props = {
  initialOrders: Order[]
  todayCount: number
}

export function OrdersAdminClient({ initialOrders, todayCount }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide">PEDIDOS</h1>
        <p className="text-white/40 text-sm mt-1">Pedidos recebidos pelo site</p>
      </div>

      {/* Today stat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Pedidos hoje</p>
          <p className="font-display text-4xl text-brand-600">{todayCount}</p>
        </div>
        <div className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Total registrados</p>
          <p className="font-display text-4xl">{initialOrders.length}</p>
        </div>
        <div className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Faturamento hoje</p>
          <p className="font-display text-4xl text-green-400">
            {formatCurrency(
              initialOrders
                .filter((o) => {
                  const d = new Date(o.created_at)
                  const now = new Date()
                  return (
                    d.getDate() === now.getDate() &&
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                  )
                })
                .reduce((s, o) => s + Number(o.total), 0)
            )}
          </p>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">#</th>
                <th className="text-left px-5 py-3.5 font-medium">Cliente</th>
                <th className="text-left px-5 py-3.5 font-medium hidden md:table-cell">CPF</th>
                <th className="text-left px-5 py-3.5 font-medium">Telefone</th>
                <th className="text-left px-5 py-3.5 font-medium hidden lg:table-cell">Tipo</th>
                <th className="text-right px-5 py-3.5 font-medium">Total</th>
                <th className="text-right px-5 py-3.5 font-medium hidden sm:table-cell">Data</th>
                <th className="text-center px-5 py-3.5 font-medium">Itens</th>
              </tr>
            </thead>
            <tbody>
              {initialOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-white/30">
                    Nenhum pedido registrado ainda.
                  </td>
                </tr>
              ) : (
                initialOrders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors last:border-0"
                    >
                      <td className="px-5 py-3 font-mono text-brand-600 font-bold">
                        #{order.order_number}
                      </td>
                      <td className="px-5 py-3 font-medium">{order.customer_name}</td>
                      <td className="px-5 py-3 text-white/50 hidden md:table-cell font-mono text-xs">
                        {order.customer_cpf ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-white/70 font-mono text-xs">
                        {order.customer_phone}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            order.delivery_type === 'delivery'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-green-500/15 text-green-400'
                          }`}
                        >
                          {order.delivery_type === 'delivery' ? '🏠 Entrega' : '🏃 Retirada'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-brand-600">
                        {formatCurrency(Number(order.total))}
                      </td>
                      <td className="px-5 py-3 text-right text-white/40 text-xs hidden sm:table-cell">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                          className="text-xs text-white/40 hover:text-brand-600 transition-colors underline"
                        >
                          {expanded === order.id ? 'Fechar' : `Ver ${order.items.length}`}
                        </button>
                      </td>
                    </tr>

                    {expanded === order.id && (
                      <tr key={`${order.id}-detail`} className="border-b border-white/5 bg-surface/40">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm">
                                <span className="text-white/30 w-5 text-right shrink-0">{item.quantity}×</span>
                                <div className="flex-1">
                                  <span className="font-medium">{item.name}</span>
                                  {item.extras.length > 0 && (
                                    <span className="text-white/40 text-xs ml-2">
                                      + {item.extras.map((e) => e.name).join(', ')}
                                    </span>
                                  )}
                                  {item.observation && (
                                    <span className="text-white/30 text-xs ml-2">📝 {item.observation}</span>
                                  )}
                                </div>
                                <span className="text-brand-600 font-semibold shrink-0">
                                  {formatCurrency(item.item_total)}
                                </span>
                              </div>
                            ))}
                            {order.address && (
                              <p className="text-xs text-white/40 mt-2 pt-2 border-t border-white/5">
                                📍 {order.address}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
