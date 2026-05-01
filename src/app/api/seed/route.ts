import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Check if users already exist
    const existing = await prisma.user.count()
    if (existing > 0) {
      return NextResponse.json({ message: 'Database already seeded', count: existing })
    }

    const password = await bcrypt.hash('admin123', 12)
    const supervisorPassword = await bcrypt.hash('super123', 12)
    const buyerPassword = await bcrypt.hash('buyer123', 12)

    await prisma.user.createMany({
      data: [
        {
          email: 'admin@empresa.com',
          password,
          name: 'Administrador',
          role: 'admin',
          department: 'TI',
          approvalLimit: 1000000,
          hireDate: new Date('2020-01-15'),
          isActive: true,
        },
        {
          email: 'supervisor@empresa.com',
          password: supervisorPassword,
          name: 'María Supervisor',
          role: 'supervisor',
          department: 'Compras',
          approvalLimit: 25000,
          hireDate: new Date('2021-03-20'),
          isActive: true,
        },
        {
          email: 'comprador@empresa.com',
          password: buyerPassword,
          name: 'Carlos Comprador',
          role: 'comprador',
          department: 'Compras',
          approvalLimit: 5000,
          hireDate: new Date('2022-06-01'),
          isActive: true,
        },
      ],
    })

    // Create sample requisiciones
    const admin = await prisma.user.findUnique({ where: { email: 'admin@empresa.com' } })
    const supervisor = await prisma.user.findUnique({ where: { email: 'supervisor@empresa.com' } })

    if (admin && supervisor) {
      await prisma.requisicion.createMany({
        data: [
          {
            folio: 'REQ-2026-001',
            createdById: admin.id,
            department: 'Ventas',
            description: 'Equipamiento de oficina - escritorios y sillas ergonómicas',
            items: JSON.stringify([
              { description: 'Escritorio ejecutivo', quantity: 5, unitPrice: 450, total: 2250 },
              { description: 'Silla ergonómica', quantity: 5, unitPrice: 280, total: 1400 },
            ]),
            totalAmount: 3650,
            urgency: 'normal',
            status: 'approved',
          },
          {
            folio: 'REQ-2026-002',
            createdById: supervisor.id,
            department: 'TI',
            description: 'Laptops para nuevo personal del departamento',
            items: JSON.stringify([
              { description: 'MacBook Pro 14"', quantity: 3, unitPrice: 2499, total: 7497 },
            ]),
            totalAmount: 7497,
            urgency: 'urgent',
            status: 'pending',
          },
          {
            folio: 'REQ-2026-003',
            createdById: admin.id,
            department: 'Marketing',
            description: 'Material para campaña Q2',
            items: JSON.stringify([
              { description: 'Flyers impresos', quantity: 1000, unitPrice: 0.85, total: 850 },
              { description: 'Banners retractiles', quantity: 10, unitPrice: 120, total: 1200 },
            ]),
            totalAmount: 2050,
            urgency: 'high',
            status: 'pending',
          },
        ],
      })
    }

    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 })
  }
}