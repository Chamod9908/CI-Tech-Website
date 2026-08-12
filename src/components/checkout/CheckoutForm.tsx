'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CreditCard, Truck, Landmark, Wallet, Check } from 'lucide-react';
import { SessionPayload } from '@/lib/auth';

interface CheckoutFormProps {
  session: SessionPayload | null;
  settings: Record<string, string>;
  zones: { name: string; deliveryFee: number; estimatedDays: string }[];
}

export default function CheckoutForm({ session, settings, zones }: CheckoutFormProps) {
  const { cart, cartSubtotal, clearCart } = useStore();
  
  // Form fields
  const [customerName, setCustomerName] = useState(session?.name || '');
  const [customerEmail, setCustomerEmail] = useState(session?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [deliveryMethod, setDeliveryMethod] = useState('ISLANDWIDE');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Load session defaults and check coupon
  useEffect(() => {
    const savedCart = localStorage.getItem('colorlab_cart');
    if (savedCart && savedCart.includes('WELCOME10')) {
      setTimeout(() => {
        setCouponCode('WELCOME10');
        setDiscount(cartSubtotal * 0.1);
      }, 0);
    }
  }, [cartSubtotal]);

  // Find fee for selected district
  const selectedZone = zones.find(z => z.name === district) || zones[0];
  const deliveryFee = deliveryMethod === 'STORE_PICKUP' ? 0 : Number(selectedZone?.deliveryFee || 600);
  const grandTotal = cartSubtotal - discount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          district,
          deliveryMethod,
          paymentMethod,
          cartItems: cart,
          couponCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        window.location.href = `/checkout/success?orderNumber=${data.orderNumber}`;
      } else {
        setErrorMsg(data.error || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Shipping Address and Payment selection */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Contact Info card */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-lg font-extrabold text-dark tracking-tight">1. Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Ishan Liyanaarachchi"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 0771234567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. ishan@gmail.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </div>

        {/* Shipping details */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-lg font-extrabold text-dark tracking-tight">2. Shipping Destination</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-dark uppercase tracking-wider block">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-gray-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark focus:outline-none focus:border-primary"
              >
                {zones.map((z) => (
                  <option key={z.name} value={z.name}>
                    {z.name} (Rs. {Number(z.deliveryFee).toFixed(0)})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-dark uppercase tracking-wider block">Delivery Option</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-full border border-gray-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark focus:outline-none focus:border-primary"
              >
                <option value="ISLANDWIDE">Standard Delivery ({selectedZone?.estimatedDays || '2-3 Days'})</option>
                <option value="STORE_PICKUP">Store Pickup (Colombo Branch - Free)</option>
              </select>
            </div>
          </div>

          <Input
            label="Street Address / City"
            placeholder="e.g. No 123, Galle Road, Colombo 03"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
          />
        </div>

        {/* Payment options */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-lg font-extrabold text-dark tracking-tight">3. Payment Method</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                paymentMethod === 'COD' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-gray-border text-dark hover:border-dark'
              }`}
            >
              <Wallet size={20} />
              <span className="text-xs">Cash on Delivery</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('BANK_TRANSFER')}
              className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                paymentMethod === 'BANK_TRANSFER' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-gray-border text-dark hover:border-dark'
              }`}
            >
              <Landmark size={20} />
              <span className="text-xs">Bank Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('ONLINE')}
              className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                paymentMethod === 'ONLINE' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-gray-border text-dark hover:border-dark'
              }`}
            >
              <CreditCard size={20} />
              <span className="text-xs">Online Card Pay</span>
            </button>
          </div>

          {/* Conditional helpers */}
          {paymentMethod === 'BANK_TRANSFER' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-xs space-y-1 leading-relaxed">
              <p className="font-bold">Bank Transfer Account Details:</p>
              <p className="font-medium text-dark">{settings.bank_details_transfer || 'Commercial Bank | C.I. Technologies | Account: 1234567890'}</p>
              <p className="text-gray-text text-[10px]">Please transfer the grand total and send a snapshot of your receipt to WhatsApp with your Order ID.</p>
            </div>
          )}

          {paymentMethod === 'ONLINE' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs leading-relaxed">
              <p className="font-bold">Online Gateway Abstraction Notice:</p>
              <p className="text-[10px] text-gray-text mt-0.5">
                We support Webpay/PayHere/IPG integrations. For this development build, this is abstracted. Clicking place order will simulate a card payment success.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Cart Summary Panel */}
      <div className="space-y-6">
        <div className="bg-bg-light border border-gray-border rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-lg text-dark tracking-tight">Order Invoice Summary</h3>
          
          {/* Cart items list */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-4 text-xs font-medium border-b border-gray-100 pb-2">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-dark truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-text font-bold">Qty: {item.quantity}</p>
                </div>
                <span className="text-dark shrink-0 font-bold">
                  Rs. {(item.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing math breakdown */}
          <div className="space-y-2 border-t border-gray-border pt-4 text-sm font-semibold">
            <div className="flex justify-between">
              <span className="text-gray-text">Subtotal</span>
              <span className="text-dark">Rs. {cartSubtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent-red">
                <span>Coupon Discount</span>
                <span>-Rs. {discount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-text">Delivery Fee ({district})</span>
              <span className="text-dark">
                {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>

          {/* Grand total */}
          <div className="flex justify-between items-baseline border-t border-gray-border pt-4">
            <span className="text-base font-bold text-dark">Grand Total</span>
            <span className="text-xl font-black text-primary">
              Rs. {grandTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="bg-red-50 text-accent-red border border-red-100 p-2.5 rounded-lg text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Place Order CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold text-base py-3"
              isLoading={isLoading}
            >
              Place Order <Check size={18} />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
