import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getAllSiteSettings } from '@/lib/settings';
import OrderWorkflow from '@/components/admin/OrderWorkflow';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getSession();
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          options: true,
          files: true,
        },
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const settings = await getAllSiteSettings();

  // Map decimal fields to number to prevent Next.js serializing exceptions
  const plainOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    deliveryFee: Number(order.deliveryFee),
    grandTotal: Number(order.grandTotal),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      specialInstructions: item.specialInstructions,
      options: item.options.map(opt => ({
        id: opt.id,
        optionName: opt.optionName,
        optionValue: opt.optionValue,
        priceAdjustment: Number(opt.priceAdjustment),
      })),
      files: item.files.map(file => ({
        id: file.id,
        filename: file.filename,
        fileType: file.fileType,
        fileSize: file.fileSize,
        url: file.url,
        uploadedBy: file.uploadedBy,
      })),
    })),
    statusHistory: order.statusHistory.map(history => ({
      id: history.id,
      status: history.status,
      notes: history.notes,
      createdAt: history.createdAt.toISOString(),
    })),
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back to Active Orders List
        </Link>
      </div>

      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Order #{order.orderNumber}</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Registered on {new Date(order.createdAt).toLocaleString('en-LK')}
          </p>
        </div>
      </div>

      <OrderWorkflow
        order={plainOrder}
        role={session.role}
        settings={settings}
      />
    </div>
  );
}
