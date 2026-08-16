import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    // Route guard: restrict to staff
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes, trackingNumber } = body;

    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Run update in transaction to record status history log
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const dataToUpdate: Record<string, unknown> = {};
      
      if (status) dataToUpdate.status = status as OrderStatus;
      if (trackingNumber !== undefined) dataToUpdate.trackingNumber = trackingNumber;

      const order = await tx.order.update({
        where: { id },
        data: dataToUpdate,
      });

      // Write status history log if status changed or notes added
      if (status || notes) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: (status as OrderStatus) || currentOrder.status,
            notes: notes || `Order updated by ${session.name}.`,
            changedByUserId: session.userId,
          },
        });
      }

      return order;
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Order PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update order details' }, { status: 500 });
  }
}
