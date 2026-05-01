import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions)

  // Get pending approvals for current user
  const pendingApprovals = await prisma.approval.findMany({
    where: {
      approverId: session?.user?.id,
      status: 'pending'
    },
    include: {
      requisicion: {
        include: {
          createdBy: { select: { name: true, email: true } }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  // Get recent approval history
  const approvalHistory = await prisma.approval.findMany({
    where: {
      approverId: session?.user?.id,
      status: { not: 'pending' }
    },
    include: {
      requisicion: { select: { folio: true, description: true, totalAmount: true } }
    },
    orderBy: { updatedAt: 'desc' },
    take: 10
  })

  const getLevelName = (level: number) => {
    const levels: Record<number, string> = {
      1: 'Solicitante',
      2: 'Comprador',
      3: 'Supervisor',
      4: 'Gerente',
      5: 'Director',
      6: 'CFO'
    }
    return levels[level] || `Nivel ${level}`
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Aprobaciones</h2>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pendientes de Aprobación ({pendingApprovals.length})
          </h3>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No tienes aprobaciones pendientes 🎉
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {approval.requisicion.folio}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {approval.requisicion.description}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Solicitado por: {approval.requisicion.createdBy.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${approval.requisicion.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {approval.requisicion.currency}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Nivel {approval.level}: {getLevelName(approval.level)}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    approval.requisicion.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                    approval.requisicion.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {approval.requisicion.urgency}
                  </span>
                  <span>
                    Creado: {approval.requisicion.createdAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-3">
                  <form action={`/api/compras/approvals/${approval.id}`} method="POST">
                    <input type="hidden" name="action" value="approve" />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      ✅ Aprobar
                    </button>
                  </form>
                  <form>
                    <button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      ❌ Rechazar
                    </button>
                  </form>
                  <form>
                    <button
                      type="button"
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm"
                    >
                      🔄 Escalar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Aprobaciones</h3>
        </div>

        {approvalHistory.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No hay historial de aprobaciones
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Requisición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Decisión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Comentarios
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvalHistory.map((approval) => (
                <tr key={approval.id}>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {approval.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {approval.requisicion.folio}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${approval.requisicion.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {approval.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {approval.comments || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}