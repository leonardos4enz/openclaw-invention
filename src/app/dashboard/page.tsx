import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Get stats
  const [
    requisicionesCount,
    pendingApprovals,
    ordenesCount,
    recentRequisiciones
  ] = await Promise.all([
    prisma.requisicion.count(),
    prisma.approval.count({ where: { status: 'pending' } }),
    prisma.ordenCompra.count(),
    prisma.requisicion.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { name: true } } }
    })
  ])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{requisicionesCount}</div>
          <div className="text-gray-600 text-sm mt-1">Requisiciones</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">{pendingApprovals}</div>
          <div className="text-gray-600 text-sm mt-1">Pendientes de Aprobación</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">{ordenesCount}</div>
          <div className="text-gray-600 text-sm mt-1">Órdenes de Compra</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-purple-600">
            {session?.user?.approvalLimit?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm mt-1">Tu Límite de Aprobación (USD)</div>
        </div>
      </div>

      {/* Recent Requisiciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Requisiciones Recientes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentRequisiciones.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No hay requisiciones todavía
            </div>
          ) : (
            recentRequisiciones.map((req) => (
              <div key={req.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{req.folio}</div>
                  <div className="text-sm text-gray-500">
                    {req.description.substring(0, 50)}...
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${req.totalAmount.toLocaleString()} {req.currency}
                  </div>
                  <div className="text-xs text-gray-500">
                    Por {req.createdBy.name}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  req.status === 'approved' ? 'bg-green-100 text-green-800' :
                  req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/dashboard/compras/requisiciones"
          className="block bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition"
        >
          <div className="text-2xl mb-2">📋</div>
          <h4 className="font-semibold text-blue-900">Nueva Requisición</h4>
          <p className="text-sm text-blue-700 mt-1">
            Crear una nueva requisición de compra
          </p>
        </a>
        <a
          href="/dashboard/compras/approvals"
          className="block bg-yellow-50 rounded-lg p-6 hover:bg-yellow-100 transition"
        >
          <div className="text-2xl mb-2">✅</div>
          <h4 className="font-semibold text-yellow-900">Aprobaciones</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Revisar requisiciones pendientes
          </p>
        </a>
        <a
          href="/dashboard/analytics"
          className="block bg-purple-50 rounded-lg p-6 hover:bg-purple-100 transition"
        >
          <div className="text-2xl mb-2">📊</div>
          <h4 className="font-semibold text-purple-900">Analytics</h4>
          <p className="text-sm text-purple-700 mt-1">
            Ver métricas y dashboards
          </p>
        </a>
      </div>
    </div>
  )
}