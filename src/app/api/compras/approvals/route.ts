import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET /api/compras/approvals - List pending approvals for current user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get pending approvals where user is the approver
  const pendingApprovals = await prisma.approval.findMany({
    where: {
      approverId: session.user.id,
      status: 'pending'
    },
    include: {
      requisicion: {
        include: {
          createdBy: { select: { name: true, email: true } }
        }
      },
      approver: { select: { name: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(pendingApprovals)
}

// POST /api/compras/approvals - Approve or reject a requisicion
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { requisicionId, action, comments, amountApproved } = body

  // action: 'approve' | 'reject' | 'escalate'

  if (!requisicionId || !action) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos' },
      { status: 400 }
    )
  }

  // Get the requisicion
  const requisicion = await prisma.requisicion.findUnique({
    where: { id: requisicionId },
    include: {
      approvals: {
        include: { approver: { select: { role: true, approvalLimit: true } } }
      }
    }
  })

  if (!requisicion) {
    return NextResponse.json({ error: 'Requisición no encontrada' }, { status: 404 })
  }

  // Determine user approval authority
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Calculate approval level based on amount
  let requiredLevel = 1
  if (requisicion.totalAmount > 100000) requiredLevel = 6
  else if (requisicion.totalAmount > 25000) requiredLevel = 5
  else if (requisicion.totalAmount > 5000) requiredLevel = 4
  else if (requisicion.totalAmount > 1000) requiredLevel = 3
  else if (requisicion.totalAmount > 100) requiredLevel = 2

  // Check if user has sufficient authority
  const roleAuthority: Record<string, number> = {
    'admin': 7,
    'director': 5,
    'gerente': 4,
    'supervisor': 3,
    'comprador': 2,
    'solicitante': 0,
    'viewer': 0
  }

  const userAuthority = roleAuthority[user.role] || 0

  if (action === 'approve' && userAuthority < requiredLevel) {
    return NextResponse.json(
      { error: 'No tiene autoridad suficiente para aprobar este monto' },
      { status: 403 }
    )
  }

  // Update or create approval record
  const approval = await prisma.approval.upsert({
    where: {
      id: requisicion.approvals[0]?.id || 'none'
    },
    create: {
      requisicionId,
      approverId: session.user.id,
      level: requiredLevel,
      status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'escalated',
      comments,
      amountApproved: action === 'approve' ? requisicion.totalAmount : null
    },
    update: {
      status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'escalated',
      comments,
      amountApproved: action === 'approve' ? requisicion.totalAmount : null
    }
  })

  // Update requisicion status
  let newStatus = requisicion.status
  if (action === 'approve') {
    newStatus = 'approved'
  } else if (action === 'reject') {
    newStatus = 'rejected'
  } else if (action === 'escalate') {
    newStatus = 'pending' // Will need manual escalation logic
  }

  await prisma.requisicion.update({
    where: { id: requisicionId },
    data: { status: newStatus }
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'approval',
      entityId: approval.id,
      action: action,
      userId: session.user.id,
      details: JSON.stringify({
        requisicionFolio: requisicion.folio,
        amount: requisicion.totalAmount,
        comments
      })
    }
  })

  return NextResponse.json({
    success: true,
    approval,
    requisicionStatus: newStatus
  })
}