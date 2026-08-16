'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Trash2, Edit } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProductRowActionsProps {
  productId: string;
  isActive: boolean;
}

export default function ProductRowActions({ productId, isActive }: ProductRowActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to toggle visibility', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (isLoading) return;
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      alert('Error deleting product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Link href={`/admin/products/${productId}`}>
        <Button size="sm" variant="outline" className="text-[10px] py-1 px-2 font-bold gap-1" disabled={isLoading}>
          <Edit size={12} /> Edit
        </Button>
      </Link>
      <Button 
        size="sm" 
        variant="outline" 
        className="text-[10px] py-1 px-2 font-bold gap-1" 
        onClick={toggleVisibility}
        disabled={isLoading}
      >
        {isActive ? <EyeOff size={12} /> : <Eye size={12} />} 
        {isActive ? 'Hide' : 'Show'}
      </Button>
      <Button 
        size="sm" 
        variant="danger" 
        className="text-[10px] py-1 px-2 font-bold gap-1 !bg-red-50 !text-red-600 !border-red-200 hover:!bg-red-100" 
        onClick={deleteProduct}
        disabled={isLoading}
      >
        <Trash2 size={12} /> Delete
      </Button>
    </div>
  );
}
