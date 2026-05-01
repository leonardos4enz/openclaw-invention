import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/requisiciones/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const requisicion = await prisma.requisicion.findUnique({
    where: { id: params.id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      approvals: {
        include: { approver: { select: { name: true } } },
        orderBy: { createdAt: 'asc' }
      },
      cotizaciones: true,
      ordenesCompra: true
    }
  })

  if (!requisicion) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json(requisicion)
}

// PATCH /api/compras/requisiciones/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { status, ...updateData } = body

  const requisicion = await prisma.requisicion.update({
    where: { id: params.id },
    data: {
      ...updateData,
      items: updateData.items ? JSON.stringify(updateData.items) : undefined
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
      action: 'updated',
      userId: session.user.id,
      details: JSON.stringify(updateData)
    }
  })

  return NextResponse.json(requisicion)
}

// DELETE /api/compras/requisiciones/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow delete if status is draft
  const existing = await prisma.requisicion.findUnique({
    where: { id: params.id }
  })

  if (!existing) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  if (existing.status !== 'draft') {
    return NextResponse.json(
      { error: 'Solo se pueden eliminar requisiciones en estado draft' },
      { status: 400 }
    )
  }

  await prisma.requisicion.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}