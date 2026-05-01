'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RequisicionItem {
  description: string
  quantity: number
  unitPrice: number
  category: string
}

interface Approval {
  id: string
  level: number
  status: string
  comments: string | null
  amountApproved: number | null
  createdAt: string
  approver: { name: string }
}

interface Requisicion {
  id: string
  folio: string
  description: string
  department: string
  totalAmount: number
  currency: string
  urgency: string
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  createdBy: { name: string }
  items: RequisicionItem[]
  approvals: Approval[]
  _count: { cotizaciones: number; ordenesCompra: number }
}

export default function RequisicionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [requisicion, setRequisicion] = useState<Requisicion | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchRequisicion()
  }, [params.id])

  const fetchRequisicion = async () => {
    try {
      const res = await fetch(`/api/compras/requisiciones/${params.id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setRequisicion(data)
    } catch (err) {
      console.error(err)
      router.push('/dashboard/compras/requisiciones')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/compras/requisiciones/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchRequisicion()
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

  if (!requisicion) return null

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }

  const urgencyColors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800',
    normal: 'bg-gray-100 text-gray-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/compras/requisiciones"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Requisiciones
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Requisición {requisicion.folio}</h1>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[requisicion.status] || 'bg-gray-100'}`}>
              {requisicion.status}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${urgencyColors[requisicion.urgency] || 'bg-gray-100'}`}>
              {requisicion.urgency}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {requisicion.status === 'draft' && (
            <>
              <Link
                href={`/dashboard/compras/requisiciones/${requisicion.id}/editar`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Editar
              </Link>
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {actionLoading ? 'Enviando...' : 'Enviar a Aprobación'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500">Departamento</label>
                <p className="text-gray-900">{requisicion.department}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Creado por</label>
                <p className="text-gray-900">{requisicion.createdBy.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Fecha de creación</label>
                <p className="text-gray-900">{new Date(requisicion.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Monto Total</label>
                <p className="text-2xl font-bold text-blue-600">
                  ${requisicion.totalAmount.toLocaleString()} {requisicion.currency}
                </p>
              </div>
            </div>
            {requisicion.description && (
              <div className="mt-4">
                <label className="block text-sm text-gray-500">Descripción</label>
                <p className="text-gray-900">{requisicion.description}</p>
              </div>
            )}
            {requisicion.notes && (
              <div className="mt-4">
                <label className="block text-sm text-gray-500">Notas</label>
                <p className="text-gray-700">{requisicion.notes}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Artículos Solicitados</h3>
            {requisicion.items && requisicion.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Descripción</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Categoría</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Precio Unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requisicion.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{item.category || '-'}</td>
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
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Resumen</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Cotizaciones</span>
                <span className="font-medium">{requisicion._count.cotizaciones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Órdenes de Compra</span>
                <span className="font-medium">{requisicion._count.ordenesCompra}</span>
              </div>
            </div>
          </div>

          {/* Approvals */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Aprobaciones</h4>
            {requisicion.approvals && requisicion.approvals.length > 0 ? (
              <div className="space-y-3">
                {requisicion.approvals.map((approval) => (
                  <div key={approval.id} className="border-l-2 border-gray-200 pl-3">
                    <div className="text-sm font-medium text-gray-900">Nivel {approval.level}</div>
                    <div className="text-xs text-gray-500">{approval.approver.name}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {approval.status}
                    </span>
                    {approval.comments && (
                      <p className="text-xs text-gray-600 mt-1">{approval.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sin aprobaciones</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Acciones Rápidas</h4>
            <div className="space-y-2">
              <Link
                href={`/dashboard/compras/cotizaciones/nueva?requisicionId=${requisicion.id}`}
                className="block w-full text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                + Nueva Cotización
              </Link>
              <Link
                href={`/dashboard/compras/ordenes-compra/nueva?requisicionId=${requisicion.id}`}
                className="block w-full text-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                + Crear Orden de Compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}