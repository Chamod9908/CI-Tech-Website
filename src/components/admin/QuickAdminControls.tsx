'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Trash2, Loader2, Tag, Edit3, X, Save } from 'lucide-react';

interface QuickProductControlsProps {
  productId: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  productName?: string;
  currentPrice?: number;
  currentSalePrice?: number | null;
}

export function QuickProductControls({
  productId,
  isActive,
  isSuperAdmin,
  productName = 'Product',
  currentPrice = 0,
  currentSalePrice = null,
}: QuickProductControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editPrice, setEditPrice] = useState(String(currentPrice || ''));
  const [editSalePrice, setEditSalePrice] = useState(currentSalePrice ? String(currentSalePrice) : '');

  if (!isSuperAdmin) return null;

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update product visibility');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.warning) {
          alert(data.warning);
        }
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: Number(editPrice),
          salePrice: editSalePrice ? Number(editSalePrice) : null,
        }),
      });
      if (res.ok) {
        setShowPriceModal(false);
        router.refresh();
      } else {
        alert('Failed to update product prices');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-2 right-2 flex items-center gap-1 z-30 select-none">
        {/* Quick Price & Sale Price Edit */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPriceModal(true);
          }}
          className="bg-white/90 hover:bg-white border border-gray-border p-1 rounded-md text-dark hover:text-primary transition-all shadow-xs cursor-pointer"
          title="Quick Edit Price & Sale Price (Admin)"
        >
          <Tag size={12} className="text-primary" />
        </button>

        <button
          type="button"
          onClick={handleToggleActive}
          disabled={loading}
          className="bg-white/90 hover:bg-white border border-gray-border p-1 rounded-md text-dark hover:text-primary transition-all shadow-xs cursor-pointer"
          title={isActive ? 'Hide Product (Super Admin)' : 'Show Product (Super Admin)'}
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin text-primary" />
          ) : isActive ? (
            <Eye size={12} className="text-dark" />
          ) : (
            <EyeOff size={12} className="text-accent-red" />
          )}
        </button>
        
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="bg-white/90 hover:bg-white border border-gray-border p-1 rounded-md text-dark hover:text-accent-red transition-all shadow-xs cursor-pointer"
          title="Delete Product (Super Admin)"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Quick Price Edit Modal */}
      {showPriceModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white border border-gray-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowPriceModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-dark p-1 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-dark tracking-tight">Quick Edit Prices</h3>
              <p className="text-xs text-gray-text truncate">{productName}</p>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-dark tracking-wider block">
                  Regular Price (Rs.)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full border border-gray-border rounded-lg px-3 py-2 text-xs bg-white text-dark focus:outline-none focus:border-primary font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-dark tracking-wider block">
                  Promotional Sale Price (Rs.) [Optional]
                </label>
                <input
                  type="number"
                  placeholder="Leave blank for regular price"
                  value={editSalePrice}
                  onChange={(e) => setEditSalePrice(e.target.value)}
                  className="w-full border border-gray-border rounded-lg px-3 py-2 text-xs bg-white text-dark focus:outline-none focus:border-primary font-bold text-accent-red"
                />
                <span className="text-[9px] text-gray-text block">
                  Setting a Sale Price automatically highlights this item under &quot;On-Sale Products&quot;.
                </span>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPriceModal(false)}
                  className="px-3 py-1.5 bg-gray-100 text-dark font-bold text-xs rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface QuickCategoryControlsProps {
  categoryId: string;
  isEnabled: boolean;
  isSuperAdmin: boolean;
}

export function QuickCategoryControls({ categoryId, isEnabled, isSuperAdmin }: QuickCategoryControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isSuperAdmin) return null;

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !isEnabled }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update category status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.warning) {
          alert(data.warning);
        }
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 select-none z-10 shrink-0">
      <button
        type="button"
        onClick={handleToggleActive}
        disabled={loading}
        className="text-gray-text hover:text-primary transition-all p-0.5 rounded cursor-pointer"
        title={isEnabled ? 'Hide Category (Super Admin)' : 'Show Category (Super Admin)'}
      >
        {loading ? (
          <Loader2 size={10} className="animate-spin" />
        ) : isEnabled ? (
          <Eye size={10} className="text-gray-400" />
        ) : (
          <EyeOff size={10} className="text-accent-red" />
        )}
      </button>
      
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-gray-text hover:text-accent-red transition-all p-0.5 rounded cursor-pointer"
        title="Delete Category (Super Admin)"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
}
