'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import Button from '@/components/ui/Button';
import { Trash2, ShoppingBag, ArrowRight, Ticket, Info } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Seeding dynamic promo codes for testing
    if (code === 'WELCOME10') {
      const amt = cartSubtotal * 0.1;
      setDiscount(amt);
      setCouponSuccess('Promo coupon WELCOME10 applied! You saved 10% on your items.');
    } else if (code === 'FREEPRINT') {
      setDiscount(Math.min(500, cartSubtotal));
      setCouponSuccess('Promo coupon FREEPRINT applied! Flat Rs. 500.00 discount applied.');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 for 10% off.');
      setDiscount(0);
    }
  };

  const deliveryEstimate = cartSubtotal > 5000 ? 0 : 350; // Free delivery over Rs 5000
  const grandTotal = cartSubtotal - discount + deliveryEstimate;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Your Cart is Currently Empty</h1>
          <p className="text-sm text-gray-text mt-2">
            Browse our custom frames, photo printing paper options, and personalized gift sections to get started.
          </p>
        </div>
        <Link href="/shop" className="inline-block pt-2">
          <Button variant="primary">
            Explore Shop Catalog <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-gray-300 transition-colors"
            >
              {/* Product preview image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=200'}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Product metadata */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-extrabold text-sm sm:text-base text-dark truncate">
                  {item.name}
                </h3>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-text font-semibold">
                    {item.selectedOptions.map((opt, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-sm">
                        {opt.option}: <span className="text-dark font-extrabold">{opt.value}</span>
                      </span>
                    ))}
                  </div>
                )}
                {item.specialInstructions && (
                  <p className="text-[11px] text-primary font-semibold line-clamp-1 italic">
                    Note: &quot;{item.specialInstructions}&quot;
                  </p>
                )}
              </div>

              {/* Actions, Quantity, and Price */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 shrink-0">
                {/* Quantity increment controls */}
                <div className="flex items-center border border-gray-border rounded-lg overflow-hidden bg-white select-none">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 hover:bg-gray-50 text-dark font-black text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-dark min-w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 hover:bg-gray-50 text-dark font-black text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal and delete */}
                <div className="text-right flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-text">Total</span>
                    <span className="text-sm font-black text-dark">
                      Rs. {(item.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-text hover:text-accent-red transition-colors p-1.5 hover:bg-gray-50 rounded-full"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout Invoice Breakdown */}
        <div className="space-y-6">
          <div className="bg-bg-light border border-gray-border rounded-2xl p-6 space-y-6">
            <h3 className="font-extrabold text-lg text-dark tracking-tight">Order Invoice Summary</h3>
            
            {/* Calculation summary list */}
            <div className="space-y-3 text-sm border-b border-gray-border pb-4">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-text">Subtotal ({cartCount} items)</span>
                <span className="text-dark">Rs. {cartSubtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-semibold text-accent-red">
                  <span>Coupon Discount</span>
                  <span>-Rs. {discount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span className="text-gray-text">Delivery Fee Estimate</span>
                <span className="text-dark">
                  {deliveryEstimate === 0 ? 'FREE' : `Rs. ${deliveryEstimate.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              {deliveryEstimate > 0 && (
                <div className="text-[10px] text-gray-text flex items-center gap-1">
                  <Info size={12} className="text-primary shrink-0" /> Free delivery for orders above Rs. 5,000.00
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-dark">Grand Total</span>
              <span className="text-2xl font-black text-primary">
                Rs. {grandTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Coupon Code Panel */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-dark uppercase tracking-wider block">Have a Coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.g., WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-border rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-primary uppercase text-dark placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-dark hover:bg-soft-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Ticket size={14} /> Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] font-semibold text-accent-red">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] font-semibold text-green-700">{couponSuccess}</p>}
            </form>

            {/* Proceed to Checkout CTA */}
            <div className="pt-2">
              <Link href="/checkout">
                <Button variant="primary" size="lg" className="w-full font-bold text-base py-3">
                  Proceed to Checkout <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
