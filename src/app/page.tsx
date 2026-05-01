export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">ERP Compras</h1>
        <p className="text-center text-gray-600 mb-8">Sistema de Gestión Empresarial</p>
        <div className="space-y-4">
          <a href="/login" className="block w-full text-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">
            Iniciar Sesión
          </a>
          <a href="/dashboard" className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition">
            Ir al Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}