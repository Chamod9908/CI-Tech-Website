'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { ClipboardList, Printer, Save, FileText, Check, AlertCircle, UploadCloud, CheckCircle2, MessageCircle, Copy, Heart } from 'lucide-react';

interface OrderItemOption {
  id: string;
  optionName: string;
  optionValue: string;
  priceAdjustment: number | string;
}

interface OrderFile {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
  specialInstructions?: string | null;
  options: OrderItemOption[];
  files: OrderFile[]; // Wait, let's map any files related to order items
}

interface HistoryLog {
  id: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  user?: { name: string } | null;
}

interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotal: number | string;
  discount: number | string;
  deliveryFee: number | string;
  grandTotal: number | string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  trackingNumber?: string | null;
  createdAt: string;
  items: OrderItem[];
  statusHistory: HistoryLog[];
}

interface OrderWorkflowProps {
  order: OrderType;
  role: string;
  settings: Record<string, string>;
}

export default function OrderWorkflow({ order, role, settings }: OrderWorkflowProps) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Designer completed files upload
  const [designerFiles, setDesignerFiles] = useState<OrderFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const statuses = [
    'NEW_ORDER',
    'CONFIRMED',
    'DESIGNING',
    'DESIGN_APPROVED',
    'PRINTING',
    'QUALITY_CHECK',
    'READY',
    'DISPATCHED',
    'DELIVERED',
    'CANCELLED',
  ];

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setFeedbackMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingNumber,
          notes: statusNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg('Order details updated successfully.');
        setStatusNotes('');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setErrorMsg(data.error || 'Failed to update order.');
      }
    } catch (err) {
      setErrorMsg('Network error updating order.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    // Open a new print window and render A4 invoice
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const brandName = settings.site_name || 'C.I. Technologies & Color Lab';
    const hashtag = settings.brand_hashtag || '#colorlab99';
    const address = settings.store_address || '99 Main Street, Colombo, Sri Lanka';
    const phone = settings.contact_phone || '+94 77 123 4567';
    const email = settings.contact_email || 'info@colorlab99.lk';

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px 0;">
          <div style="font-weight: bold; font-size: 13px;">${item.name}</div>
          ${
            item.options && item.options.length > 0
              ? `<div style="font-size: 10px; color: #666; margin-top: 2px;">
                  ${item.options.map((o) => `${o.optionName}: ${o.optionValue}`).join(', ')}
                 </div>`
              : ''
          }
          ${item.specialInstructions ? `<div style="font-size: 10px; color: #e07a5f; font-style: italic; margin-top: 2px;">Note: "${item.specialInstructions}"</div>` : ''}
        </td>
        <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; text-align: right;">Rs. ${Number(item.price).toFixed(2)}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: bold;">Rs. ${Number(item.subtotal).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            body { font-family: 'Inter', sans-serif; color: #111; margin: 40px; line-height: 1.4; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 800; }
            .logo span { color: #f97316; }
            .invoice-details { margin: 30px 0; display: flex; justify-content: space-between; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { border-bottom: 2px solid #ddd; padding: 10px 0; text-align: left; font-size: 11px; text-transform: uppercase; color: #666; }
            .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
            .totals-table { width: 300px; font-size: 12px; }
            .totals-table tr td { padding: 6px 0; }
            .footer { margin-top: 80px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo"><span>C.I.</span> Technologies</div>
              <div style="font-size: 10px; font-weight: bold; color: #666; letter-spacing: 2px; margin-top: 4px;">COLOR LAB & STUDIO</div>
              <div style="font-size: 10px; color: #777; margin-top: 6px;">${address}<br>Phone: ${phone} | Email: ${email}</div>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: #f97316; font-size: 24px;">INVOICE</h2>
              <p style="font-size: 12px; font-weight: bold; margin: 6px 0 0 0;">Number: ${order.orderNumber}</p>
              <p style="font-size: 11px; color: #666; margin: 2px 0 0 0;">Date: ${new Date(order.createdAt).toLocaleDateString('en-LK')}</p>
            </div>
          </div>

          <div class="invoice-details">
            <div>
              <h4 style="margin: 0 0 6px 0; text-transform: uppercase; color: #666; font-size: 10px; letter-spacing: 1px;">Invoice To:</h4>
              <p style="margin: 0; font-weight: bold; font-size: 14px;">${order.customerName}</p>
              <p style="margin: 4px 0 0 0;">Phone: ${order.customerPhone}</p>
              <p style="margin: 2px 0 0 0;">Email: ${order.customerEmail}</p>
            </div>
            <div style="text-align: right; max-w: 300px;">
              <h4 style="margin: 0 0 6px 0; text-transform: uppercase; color: #666; font-size: 10px; letter-spacing: 1px;">Shipment coordinates:</h4>
              <p style="margin: 0; font-weight: 600;">${order.shippingAddress}</p>
              <p style="margin: 4px 0 0 0; font-weight: bold;">Payment Method: ${order.paymentMethod}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 20%; text-align: right;">Unit Price</th>
                <th style="width: 20%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">Rs. ${Number(order.subtotal).toFixed(2)}</td>
              </tr>
              ${
                Number(order.discount) > 0
                  ? `<tr style="color: #d90429;">
                      <td>Discount:</td>
                      <td style="text-align: right;">-Rs. ${Number(order.discount).toFixed(2)}</td>
                     </tr>`
                  : ''
              }
              <tr>
                <td>Delivery Fee:</td>
                <td style="text-align: right;">Rs. ${Number(order.deliveryFee).toFixed(2)}</td>
              </tr>
              <tr style="font-size: 15px; font-weight: bold; border-top: 1px solid #ddd;">
                <td style="padding-top: 10px; color: #f97316;">Grand Total:</td>
                <td style="text-align: right; padding-top: 10px; color: #f97316;">Rs. ${Number(order.grandTotal).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p style="font-weight: bold; font-size: 12px; margin: 0 0 4px 0;">Thank You for Your Business!</p>
            <p style="margin: 0; font-size: 10px; color: #888;">If you have any questions about this invoice, contact us directly.</p>
            <p style="margin: 10px 0 0 0; font-weight: bold; color: #f97316; font-size: 11px;">${hashtag}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Order specs & file downloads (Left Columns) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Customer & address details */}
        <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Client Coordinates</h3>
            <p className="text-sm font-extrabold text-dark">{order.customerName}</p>
            <p className="text-xs text-gray-text">Phone: <span className="text-dark font-semibold">{order.customerPhone}</span></p>
            <p className="text-xs text-gray-text">Email: <span className="text-dark font-semibold">{order.customerEmail}</span></p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Delivery Destination</h3>
            <p className="text-xs text-dark font-semibold leading-relaxed">{order.shippingAddress}</p>
            <p className="text-[10px] text-gray-text font-bold">Courier: {order.paymentMethod} | {order.paymentStatus}</p>
          </div>
        </div>

        {/* Order Line Items */}
        <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Configure Items</h3>
          
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-dark">{item.name}</h4>
                    <p className="text-[10px] text-gray-text font-semibold">Qty: {item.quantity} x Rs. {Number(item.price).toFixed(2)}</p>
                  </div>
                  <span className="text-sm font-black text-dark">Rs. {Number(item.subtotal).toFixed(2)}</span>
                </div>

                {/* Selected custom options list */}
                {item.options && item.options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((opt) => (
                      <span key={opt.id} className="bg-bg-light border border-gray-200 px-2 py-0.5 rounded text-[10px] font-semibold text-dark">
                        {opt.optionName}: <strong className="text-primary">{opt.optionValue}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Customer upload files download */}
                <div className="bg-bg-light p-3 rounded-lg border border-gray-200 space-y-2">
                  <p className="text-[9px] text-gray-text font-bold uppercase tracking-wider">Customer Uploaded Assets:</p>
                  {/* Let's mock download capability since files are saved locally in secure_uploads/ */}
                  {/* In our DB checkout, files are logged. For local development demo, we render a simulated download link */}
                  <div className="text-xs font-semibold text-primary flex items-center gap-2">
                    <FileText size={14} />
                    <span>print-asset-preview.jpg</span>
                    <a
                      href="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-border hover:border-primary text-dark text-[9px] px-2 py-1 rounded ml-auto hover:text-primary transition-all"
                    >
                      Download (Original)
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Admin actions (Right Panel) */}
      <div className="space-y-6">
        
        {/* Quick actions panel */}
        <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest">Workflow Control</h3>
            <button
              onClick={handlePrint}
              className="text-primary hover:text-primary-hover p-1.5 hover:bg-gray-100 rounded-full transition-all flex items-center gap-1 text-xs font-bold"
              title="Print A4 Invoice"
            >
              <Printer size={16} /> Print Invoice
            </button>
          </div>

          <form onSubmit={handleUpdateOrder} className="space-y-4">
            {/* Status change select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Update Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-border rounded-lg px-3 py-2 text-xs bg-white text-dark focus:outline-none focus:border-primary font-semibold"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Courier tracking code */}
            <Input
              label="Courier Tracking Code"
              placeholder="e.g. PR-99120-LK"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />

            {/* Workflow Comment notes */}
            <Textarea
              label="Workflow Audit Comment / Notes"
              placeholder="Add update notes (e.g., 'Photo resized for 8x12 boundary. Ready for printing.')"
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
            />

            {errorMsg && (
              <div className="bg-red-50 text-accent-red border border-red-100 p-2.5 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {feedbackMsg && (
              <div className="bg-green-50 text-green-700 border border-green-200 p-2.5 rounded-lg text-xs font-semibold">
                {feedbackMsg}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 font-bold text-xs"
              isLoading={isUpdating}
            >
              Save Workflow Changes <Save size={14} />
            </Button>
          </form>

          {/* Order Completed Thank You Banner when status is DELIVERED */}
          {(status === 'DELIVERED' || order.status === 'DELIVERED') && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 text-emerald-950 animate-fade-in shadow-xs mt-4">
              <div className="flex items-center justify-between text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Order Completed Message
                </span>
                <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">DELIVERED</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-2 text-xs leading-relaxed">
                <p className="font-black text-emerald-900 tracking-wide uppercase">ORDER COMPLETED!</p>
                <p className="text-gray-700 font-medium">
                  Thank you for choosing <strong className="text-dark">C.I. Technologies & Color Lab</strong>.
                </p>
                <p className="text-gray-700 font-medium">
                  Your order (<strong className="text-primary">{order.orderNumber}</strong>) has been successfully completed. We truly appreciate your support and trust in our service.
                </p>
                <p className="font-bold text-emerald-800">Thank you for your order! ❤️</p>
                <p className="text-gray-600 font-medium">We hope to serve you again soon.</p>
                <p className="font-extrabold text-emerald-900 pt-0.5">
                  Come again! We look forward to creating something special for you. 😊
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `ORDER COMPLETED!\n\nThank you for choosing *C.I. Technologies & Color Lab*.\n\nYour order (*${order.orderNumber}*) has been successfully completed. We truly appreciate your support and trust in our service.\n\n*Thank you for your order! ❤️*\nWe hope to serve you again soon.\n\n*Come again! We look forward to creating something special for you. 😊*`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <MessageCircle size={14} /> Send WhatsApp Message
                </a>
                
                <button
                  type="button"
                  onClick={() => {
                    const msg = `ORDER COMPLETED!\n\nThank you for choosing C.I. Technologies & Color Lab.\n\nYour order (${order.orderNumber}) has been successfully completed. We truly appreciate your support and trust in our service.\n\nThank you for your order! ❤️\nWe hope to serve you again soon.\n\nCome again! We look forward to creating something special for you. 😊`;
                    navigator.clipboard.writeText(msg);
                    alert('Completion thank-you message copied to clipboard!');
                  }}
                  className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Copy size={14} /> Copy Text
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit history list */}
        <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Order History Log</h3>
          
          <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
            {order.statusHistory.map((history) => (
              <div key={history.id} className="relative pl-5 border-l border-gray-200 last:border-0 pb-3 last:pb-0 text-[11px] leading-relaxed">
                <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-primary" />
                <p className="font-bold text-dark">{history.status.replace('_', ' ')}</p>
                {history.notes && <p className="text-gray-text italic">&quot;{history.notes}&quot;</p>}
                <span className="text-[9px] text-gray-text font-semibold block mt-0.5">
                  {new Date(history.createdAt).toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
