import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/ordenes-compra/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orden = await prisma.ordenCompra.findUnique({
    where: { id: params.id },
    include: {
      requisicion: { select: { id: true, folio: true, description: true } }
    }
  })

  if (!orden) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json(orden)
}

// PUT /api/compras/ordenes-compra/[id]
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

  const orden = await prisma.ordenCompra.update({
    where: { id: params.id },
    data: {
      ...updateData,
      items: items ? JSON.stringify(items) : undefined,
      deliveryDate: updateData.deliveryDate ? new Date(updateData.deliveryDate) : undefined
    },
    include: {
      requisicion: { select: { folio: true } }
    }
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'orden_compra',
      entityId: orden.id,
      action: 'updated',
      userId: session.user.id,
      details: JSON.stringify(updateData)
    }
  })

  return NextResponse.json(orden)
}

// PATCH /api/compras/ordenes-compra/[id]
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

  const orden = await prisma.ordenCompra.update({
    where: { id: params.id },
    data: { status },
    include: {
      requisicion: { select: { folio: true } }
    }
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'orden_compra',
      entityId: orden.id,
      action: 'status_changed',
      userId: session.user.id,
      details: JSON.stringify({ status, ocNumber: orden.ocNumber })
    }
  })

  return NextResponse.json(orden)
}

// DELETE /api/compras/ordenes-compra/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow delete if status is draft
  const existing = await prisma.ordenCompra.findUnique({
    where: { id: params.id }
  })

  if (!existing) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  if (existing.status !== 'draft') {
    return NextResponse.json(
      { error: 'Solo se pueden eliminar órdenes en estado draft' },
      { status: 400 }
    )
  }

  await prisma.ordenCompra.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}