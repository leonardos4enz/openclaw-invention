import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/ordenes-compra
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const where: any = {}
  if (status) where.status = status

  const ordenes = await prisma.ordenCompra.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      requisicion: { select: { folio: true, description: true } }
    }
  })

  return NextResponse.json(ordenes)
}

// POST /api/compras/ordenes-compra - Create OC from requisicion
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    requisicionId,
    cotizacionId,
    providerName,
    providerEmail,
    providerAddress,
    items,
    subtotal,
    tax,
    total,
    currency,
    deliveryDate,
    paymentTerms,
    notes
  } = body

  if (!requisicionId || !providerName || !items) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos' },
      { status: 400 }
    )
  }

  // Generate OC number
  const count = await prisma.ordenCompra.count()
  const ocNumber = `OC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`

  const ordenCompra = await prisma.ordenCompra.create({
    data: {
      requisicionId,
      cotizacionId,
      ocNumber,
      providerName,
      providerEmail,
      providerAddress,
      items: JSON.stringify(items),
      subtotal: subtotal || 0,
      tax: tax || 0,
      total: total || subtotal || 0,
      currency: currency || 'USD',
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      paymentTerms,
      status: 'draft',
      notes
    },
    include: {
      requisicion: { select: { folio: true } }
    }
  })

  // Update requisicion to approved if not already
  await prisma.requisicion.update({
    where: { id: requisicionId },
    data: { status: 'approved' }
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'orden_compra',
      entityId: ordenCompra.id,
      action: 'created',
      userId: session.user.id,
      details: JSON.stringify({ ocNumber, providerName, total: ordenCompra.total })
    }
  })

  return NextResponse.json(ordenCompra, { status: 201 })
}