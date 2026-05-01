import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/cotizaciones/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id: params.id },
    include: {
      requisicion: { select: { id: true, folio: true, description: true } }
    }
  })

  if (!cotizacion) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json(cotizacion)
}

// PUT /api/compras/cotizaciones/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { items, ...updateData } = body

  const cotizacion = await prisma.cotizacion.update({
    where: { id: params.id },
    data: {
      ...updateData,
      items: items ? JSON.stringify(items) : undefined,
      deliveryDate: updateData.deliveryDate ? new Date(updateData.deliveryDate) : undefined,
      validUntil: updateData.validUntil ? new Date(updateData.validUntil) : undefined
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
      action: 'updated',
      userId: session.user.id,
      details: JSON.stringify(updateData)
    }
  })

  return NextResponse.json(cotizacion)
}

// PATCH /api/compras/cotizaciones/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { status } = body

  const cotizacion = await prisma.cotizacion.update({
    where: { id: params.id },
    data: { status },
    include: {
      requisicion: { select: { folio: true } }
    }
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'cotizacion',
      entityId: cotizacion.id,
      action: 'status_changed',
      userId: session.user.id,
      details: JSON.stringify({ status, providerName: cotizacion.providerName })
    }
  })

  return NextResponse.json(cotizacion)
}

// DELETE /api/compras/cotizaciones/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow delete if status is draft
  const existing = await prisma.cotizacion.findUnique({
    where: { id: params.id }
  })

  if (!existing) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  if (existing.status !== 'draft') {
    return NextResponse.json(
      { error: 'Solo se pueden eliminar cotizaciones en estado draft' },
      { status: 400 }
    )
  }

  await prisma.cotizacion.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}