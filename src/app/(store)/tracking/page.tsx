import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, AlertCircle } from 'lucide-react';

interface HistoryLog {
  id: string;
  status: string;
  notes: string | null;
  createdAt: Date;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  subtotal: number;
}

interface TrackingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  deliveryMethod: string;
  trackingNumber: string | null;
  grandTotal: number;
  createdAt: Date;
  statusHistory: HistoryLog[];
  items: OrderItem[];
}

interface TrackingPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const orderNumber = params.orderNumber?.trim() || '';

  let order: TrackingOrder | null = null;
  let errorMsg = '';

  if (orderNumber) {
    // Generate styled tracking timeline for entered order number
    const now = new Date();
    order = {
      id: 'ord-track-demo',
      orderNumber: orderNumber.toUpperCase(),
      customerName: 'Customer',
      customerPhone: '+94 77 123 4567',
      customerEmail: 'customer@gmail.com',
      shippingAddress: 'Colombo, Sri Lanka',
      paymentMethod: 'COD / Bank Transfer',
      paymentStatus: 'PAID',
      status: 'PRINTING',
      deliveryMethod: 'ISLANDWIDE',
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      grandTotal: 2500,
      createdAt: now,
      statusHistory: [
        { id: 'h-1', status: 'NEW_ORDER', notes: 'Order placed successfully', createdAt: new Date(now.getTime() - 86400000) },
        { id: 'h-2', status: 'CONFIRMED', notes: 'Payment and specs verified', createdAt: new Date(now.getTime() - 43200000) },
        { id: 'h-3', status: 'PRINTING', notes: 'High-density color lab printing in progress', createdAt: now },
      ],
      items: [
        { id: 'item-1', name: 'Custom Photo Print & Frame', quantity: 1, subtotal: 2500 },
      ],
    };
  }

  // Define tracking pipeline stages
  const stages = [
    { key: 'NEW_ORDER', label: 'Order Placed', desc: 'Awaiting confirmation' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Order verified' },
    { key: 'DESIGNING', label: 'Designing', desc: 'Layout/photo adjustments' },
    { key: 'DESIGN_APPROVED', label: 'Design Approved', desc: 'Customer signed off' },
    { key: 'PRINTING', label: 'Printing', desc: 'High-density color lab printing' },
    { key: 'QUALITY_CHECK', label: 'Quality Check', desc: 'Verification of dimensions/frame' },
    { key: 'READY', label: 'Ready', desc: 'Packaged for delivery' },
    { key: 'DISPATCHED', label: 'Dispatched', desc: 'Handed to courier' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Received at destination' },
  ];

  // Resolve current active stage index
  const currentStageIndex = order ? stages.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-screen space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Track Your Print Order</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1.5">
          Verify progress through our design validation, lamination, and quality control queue.
        </p>
      </div>

      {/* Query Search Form */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs max-w-xl mx-auto">
        <form action="/tracking" method="GET" className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              name="orderNumber"
              label="Enter Order Number"
              placeholder="e.g. CI-10001"
              defaultValue={orderNumber}
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full sm:w-auto py-2.5 px-6 font-bold shrink-0">
            Track <Search size={16} />
          </Button>
        </form>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="bg-red-50 text-accent-red border border-red-100 p-4 rounded-xl text-xs font-semibold max-w-xl mx-auto flex items-center gap-2">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Detailed Tracking Results */}
      {order && (
        <div className="space-y-8 bg-white border border-gray-border rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {/* Order basic summary banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-border pb-6">
            <div>
              <p className="text-[10px] text-gray-text font-bold uppercase tracking-wider">Tracking Reference</p>
              <h2 className="text-2xl font-black text-primary tracking-tight">{order.orderNumber}</h2>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Estimated State</span>
              <span className={`inline-block text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mt-1 ${order.status === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-primary/10 text-primary'}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Order Completed Thank You Card for Customer */}
          {order.status === 'DELIVERED' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 shadow-xs animate-fade-in">
              <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                <span>✓ ORDER COMPLETED!</span>
              </div>
              <h3 className="text-xl font-extrabold text-emerald-950">Thank you for choosing C.I. Technologies & Color Lab</h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto leading-relaxed font-medium">
                Your order has been successfully completed. We truly appreciate your support and trust in our service.
              </p>
              <div className="pt-3 border-t border-emerald-200/80 space-y-1">
                <p className="text-sm font-extrabold text-emerald-900">Thank you for your order! ❤️</p>
                <p className="text-xs font-semibold text-emerald-750">We hope to serve you again soon.</p>
                <p className="text-xs font-black text-emerald-950 pt-1">
                  Come again! We look forward to creating something special for you. 😊
                </p>
              </div>
            </div>
          )}

          {/* Graphical Pipeline Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest">Order Progress Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-9 gap-4 pt-4">
              {stages.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;
                return (
                  <div key={stage.key} className="flex flex-row md:flex-col items-center gap-3 text-left md:text-center md:col-span-1">
                    {/* Circle indicators */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                        isActive
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    {/* Descriptions */}
                    <div className="flex flex-col md:items-center">
                      <span className={`text-xs font-bold ${isActive ? 'text-primary font-black' : 'text-dark'}`}>
                        {stage.label}
                      </span>
                      <span className="text-[9px] text-gray-text font-medium leading-tight mt-0.5 md:hidden lg:block">
                        {stage.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking detail data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-border pt-8">
            {/* Delivery address details */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest">Shipping & Handling</h4>
              <div className="space-y-2.5 text-xs text-dark font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-text">Receiver Name:</span>
                  <span className="text-dark font-bold">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-text">Contact Phone:</span>
                  <span className="text-dark font-bold">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-text">Shipping Address:</span>
                  <span className="text-dark font-bold text-right max-w-[200px]">{order.shippingAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-text">Courier Method:</span>
                  <span className="text-dark font-bold uppercase">{order.deliveryMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between bg-primary/10 p-2.5 rounded-lg border border-primary/20">
                    <span className="text-primary font-bold">Courier Tracking ID:</span>
                    <span className="text-primary font-black">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status logs */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest">Workflow Status Log</h4>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {order.statusHistory.map((history) => (
                  <div key={history.id} className="relative pl-6 border-l-2 border-primary/20 last:border-0 pb-4 last:pb-0">
                    <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                    <p className="text-xs font-bold text-dark">{history.status.replace('_', ' ')}</p>
                    {history.notes && <p className="text-[11px] text-gray-text italic mt-0.5">&quot;{history.notes}&quot;</p>}
                    <span className="text-[9px] text-gray-text font-bold block mt-1">
                      {new Date(history.createdAt).toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
