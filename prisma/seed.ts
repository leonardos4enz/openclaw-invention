import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      email: 'admin@empresa.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'admin',
      department: 'sistemas',
      approvalLimit: 1000000,
      isActive: true
    }
  })
  console.log('✅ Admin user created:', admin.email)

  // Create supervisor user
  const supervisorPassword = await bcrypt.hash('super123', 10)
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@empresa.com' },
    update: {},
    create: {
      email: 'supervisor@empresa.com',
      password: supervisorPassword,
      name: 'Juan Supervisor',
      role: 'supervisor',
      department: 'compras',
      approvalLimit: 25000,
      isActive: true
    }
  })
  console.log('✅ Supervisor user created:', supervisor.email)

  // Create some requisiciones
  const requisiciones = [
    {
      folio: 'REQ-2026-00001',
      createdById: admin.id,
      department: 'ventas',
      description: 'Compra de laptops para nuevo personal de ventas',
      items: JSON.stringify([
        { description: 'Laptop Dell XPS 15', quantity: 3, unitPrice: 1500, category: 'Tecnología' },
        { description: 'Mouse inalámbrico', quantity: 3, unitPrice: 50, category: 'Accesorios' }
      ]),
      totalAmount: 4650,
      currency: 'USD',
      urgency: 'high',
      status: 'pending'
    },
    {
      folio: 'REQ-2026-00002',
      createdById: supervisor.id,
      department: 'compras',
      description: 'Material de oficina trimestral',
      items: JSON.stringify([
        { description: 'Resmas de papel A4', quantity: 50, unitPrice: 8, category: 'Oficina' },
        { description: 'Tóner impresora', quantity: 10, unitPrice: 45, category: 'Oficina' }
      ]),
      totalAmount: 850,
      currency: 'USD',
      urgency: 'normal',
      status: 'draft'
    },
    {
      folio: 'REQ-2026-00003',
      createdById: admin.id,
      department: 'operaciones',
      description: 'Equipamiento para bodega',
      items: JSON.stringify([
        { description: 'Estantería metálica', quantity: 5, unitPrice: 300, category: 'Mobiliario' },
        { description: 'Montacargas manual', quantity: 1, unitPrice: 1200, category: 'Equipo' }
      ]),
      totalAmount: 2700,
      currency: 'USD',
      urgency: 'normal',
      status: 'approved'
    }
  ]

  for (const req of requisiciones) {
    const existing = await prisma.requisicion.findUnique({ where: { folio: req.folio } })
    if (!existing) {
      await prisma.requisicion.create({ data: req })
      console.log('✅ Requisicion created:', req.folio)
    }
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })