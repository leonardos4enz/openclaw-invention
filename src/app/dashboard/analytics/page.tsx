'use client'

import { useSession } from 'next-auth/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

// Mock data for demonstration
const monthlySpendData = [
  { month: 'Ene', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Abr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
]

const departmentData = [
  { name: 'Ventas', value: 35, color: '#3B82F6' },
  { name: 'Operaciones', value: 28, color: '#10B981' },
  { name: 'TI', value: 22, color: '#F59E0B' },
  { name: 'Finanzas', value: 15, color: '#EF4444' },
]

const requisicionStatusData = [
  { name: 'Aprobadas', value: 45, color: '#10B981' },
  { name: 'Pendientes', value: 25, color: '#F59E0B' },
  { name: 'Rechazadas', value: 8, color: '#EF4444' },
  { name: 'Borrador', value: 22, color: '#6B7280' },
]

const approvalCycleData = [
  { week: 'Sem 1', avgDays: 1.2 },
  { week: 'Sem 2', avgDays: 1.5 },
  { week: 'Sem 3', avgDays: 1.1 },
  { week: 'Sem 4', avgDays: 0.9 },
]

export default function AnalyticsPage() {
  const { data: session } = useSession()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics y Reportes</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">$328K</div>
          <div className="text-gray-600 text-sm mt-1">Gasto Total (YTD)</div>
          <div className="text-xs text-green-600 mt-2">↑ 12% vs año anterior</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">2.3</div>
          <div className="text-gray-600 text-sm mt-1">Días Promedio de Aprobación</div>
          <div className="text-xs text-green-600 mt-2">↓ 0.5 días vs mes anterior</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-purple-600">92%</div>
          <div className="text-gray-600 text-sm mt-1">Tasa de Aprobación</div>
          <div className="text-xs text-green-600 mt-2">↑ 3% vs mes anterior</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">156</div>
          <div className="text-gray-600 text-sm mt-1">Órdenes de Compra</div>
          <div className="text-xs text-gray-500 mt-2">Este año fiscal</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gasto Mensual */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gasto Mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gasto por Departamento */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gasto por Departamento</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Requisiciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Requisiciones</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requisicionStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {requisicionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tiempo de Aprobación */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiempo de Aprobación (días)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={approvalCycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 3]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgDays"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="mt-8 flex gap-4 justify-end">
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
          📊 Exportar a Excel
        </button>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
          📄 Generar Reporte PDF
        </button>
      </div>
    </div>
  )
}