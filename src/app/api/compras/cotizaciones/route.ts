import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/cotizaciones
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const requisicionId = searchParams.get('requisicionId')
  const status = searchParams.get('status')

  const where: any = {}
  if (requisicionId) where.requisicionId = requisicionId
  if (status) where.status = status

  const cotizaciones = await prisma.cotizacion.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      requisicion: { select: { folio: true, description: true } }
    }
  })

  return NextResponse.json(cotizaciones)
}

// POST /api/compras/cotizaciones
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    requisicionId,
    providerName,
    providerContact,
    providerEmail,
    items,
    subtotal,
    tax,
    total,
    currency,
    deliveryDate,
    deliveryTerms,
    paymentTerms,
    validUntil,
    notes
  } = body

  if (!requisicionId || !providerName || !items || subtotal === undefined) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos' },
      { status: 400 }
    )
  }

  const cotizacion = await prisma.cotizacion.create({
    data: {
      requisicionId,
      providerName,
      providerContact,
      providerEmail,
      items: JSON.stringify(items),
      subtotal,
      tax: tax || 0,
      total: total || (subtotal + (tax || 0)),
      currency: currency || 'USD',
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      deliveryTerms,
      paymentTerms,
      validUntil: validUntil ? new Date(validUntil) : null,
      status: 'draft',
      notes
    },
    include: {
      requisicion: { select: { folio: true } }
    }
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'cotizacion',
      entityId: cotizacion.id,
      action: 'created',
      userId: session.user.id,
      details: JSON.stringify({ providerName, total: cotizacion.total })
    }
  })

  return NextResponse.json(cotizacion, { status: 201 })
}