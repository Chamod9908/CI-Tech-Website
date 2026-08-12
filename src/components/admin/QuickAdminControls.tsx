'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';

interface QuickProductControlsProps {
  productId: string;
  isActive: boolean;
  isSuperAdmin: boolean;
}

export function QuickProductControls({ productId, isActive, isSuperAdmin }: QuickProductControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="absolute top-2 right-2 flex items-center gap-1 z-30 select-none">
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
