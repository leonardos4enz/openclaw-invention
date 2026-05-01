'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrdenCompra {
  id: string
  ocNumber: string
  providerName: string
  providerEmail: string | null
  providerAddress: string | null
  items: any[]
  subtotal: number
  tax: number
  total: number
  currency: string
  deliveryDate: string | null
  deliveryTerms: string | null
  paymentTerms: string | null
  status: string
  notes: string | null
  createdAt: string
  requisicion: {
    id: string
    folio: string
    description: string
  } | null
}

export default function OrdenCompraDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [orden, setOrden] = useState<OrdenCompra | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchOrden()
  }, [params.id])

  const fetchOrden = async () => {
    try {
      const res = await fetch(`/api/compras/ordenes-compra/${params.id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setOrden(data)
    } catch (err) {
      console.error(err)
      router.push('/dashboard/compras/ordenes-compra')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/compras/ordenes-compra/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchOrden()
        router.refresh()
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!orden) return null

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    partially_received: 'bg-yellow-100 text-yellow-800',
    received: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/compras/ordenes-compra"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Órdenes de Compra
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OC {orden.ocNumber}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[orden.status] || 'bg-gray-100'}`}>
              {orden.status}
            </span>
            {orden.requisicion && (
              <Link
                href={`/dashboard/compras/requisiciones/${orden.requisicion.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Ver requisición: {orden.requisicion.folio}
              </Link>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {orden.status === 'draft' && (
            <>
              <Link
                href={`/dashboard/compras/ordenes-compra/${orden.id}/editar`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Editar
              </Link>
              <button
                onClick={() => handleStatusChange('sent')}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {actionLoading ? 'Enviando...' : 'Enviar a Proveedor'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Proveedor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500">Proveedor</label>
                <p className="text-gray-900 font-medium">{orden.providerName}</p>
              </div>
              {orden.providerEmail && (
                <div>
                  <label className="block text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{orden.providerEmail}</p>
                </div>
              )}
              {orden.providerAddress && (
                <div className="col-span-2">
                  <label className="block text-sm text-gray-500">Dirección</label>
                  <p className="text-gray-900">{orden.providerAddress}</p>
                </div>
              )}
              {orden.deliveryDate && (
                <div>
                  <label className="block text-sm text-gray-500">Fecha de Entrega</label>
                  <p className="text-gray-900">{new Date(orden.deliveryDate).toLocaleDateString()}</p>
                </div>
              )}
              {orden.deliveryTerms && (
                <div>
                  <label className="block text-sm text-gray-500">Términos de Entrega</label>
                  <p className="text-gray-900">{orden.deliveryTerms}</p>
                </div>
              )}
              {orden.paymentTerms && (
                <div>
                  <label className="block text-sm text-gray-500">Términos de Pago</label>
                  <p className="text-gray-900">{orden.paymentTerms}</p>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-500">Fecha de Creación</label>
                <p className="text-gray-900">{new Date(orden.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {orden.notes && (
              <div className="mt-4">
                <label className="block text-sm text-gray-500">Notas</label>
                <p className="text-gray-700">{orden.notes}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Artículos</h3>
            {orden.items && orden.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Descripción</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Precio Unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orden.items.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No hay artículos registrados</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Totals */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Totales</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${orden.subtotal?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IVA</span>
                <span className="text-gray-900">${orden.tax?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  ${orden.total?.toLocaleString() || 0} {orden.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Acciones</h4>
            <div className="space-y-2">
              {orden.status === 'draft' && (
                <>
                  <Link
                    href={`/dashboard/compras/ordenes-compra/${orden.id}/editar`}
                    className="block w-full text-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Editar OC
                  </Link>
                  <button
                    onClick={() => handleStatusChange('sent')}
                    className="block w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Enviar a Proveedor
                  </button>
                </>
              )}
              {orden.status === 'sent' && (
                <button
                  onClick={() => handleStatusChange('partially_received')}
                  className="block w-full px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                >
                  Marcar Parcialmente Recibida
                </button>
              )}
              {(orden.status === 'sent' || orden.status === 'partially_received') && (
                <button
                  onClick={() => handleStatusChange('received')}
                  className="block w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Marcar como Recibida
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}