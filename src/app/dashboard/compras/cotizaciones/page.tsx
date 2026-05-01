import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CotizacionesPage() {
  const session = await getServerSession(authOptions)

  const cotizaciones = await prisma.cotizacion.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      requisicion: { select: { folio: true, description: true } }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cotizaciones</h2>
        <Link
          href="/dashboard/compras/cotizaciones/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Nueva Cotización
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex gap-4 flex-wrap">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="sent">Enviada</option>
            <option value="received">Recibida</option>
            <option value="accepted">Aceptada</option>
            <option value="rejected">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requisición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cotizaciones.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No hay cotizaciones todavía.
                </td>
              </tr>
            ) : (
              cotizaciones.map((cot) => (
                <tr key={cot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cot.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/compras/requisiciones/${cot.requisicionId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {cot.requisicion.folio}
                    </Link>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {cot.requisicion.description.substring(0, 30)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cot.providerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${cot.total.toLocaleString()} {cot.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cot.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      cot.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      cot.status === 'received' ? 'bg-blue-100 text-blue-800' :
                      cot.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cot.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800">
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}