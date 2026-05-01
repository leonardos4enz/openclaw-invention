import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/requisiciones - List all requisiciones
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const department = searchParams.get('department')

  const where: any = {}
  if (status) where.status = status
  if (department) where.department = department

  const requisiciones = await prisma.requisicion.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      approvals: { include: { approver: { select: { name: true } } } },
      _count: { select: { cotizaciones: true, ordenesCompra: true } }
    }
  })

  return NextResponse.json(requisiciones)
}

// POST /api/compras/requisiciones - Create new requisicion
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { department, description, items, totalAmount, currency, urgency, notes } = body

  if (!department || !description || !items || !totalAmount) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos' },
      { status: 400 }
    )
  }

  // Generate folio
  const count = await prisma.requisicion.count()
  const folio = `REQ-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`

  const requisicion = await prisma.requisicion.create({
    data: {
      folio,
      createdById: session.user.id,
      department,
      description,
      items: JSON.stringify(items),
      totalAmount,
      currency: currency || 'USD',
      urgency: urgency || 'normal',
      notes,
      status: 'draft'
    },
    include: {
      createdBy: { select: { name: true } }
    }
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'requisicion',
      entityId: requisicion.id,
      action: 'created',
      userId: session.user.id,
      details: JSON.stringify({ folio })
    }
  })

  return NextResponse.json(requisicion, { status: 201 })
}