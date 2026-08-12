'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Save, ArrowLeft, UploadCloud, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';

interface CategoryData {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
  isEnabled: boolean;
}

interface CategoryFormProps {
  initialData?: CategoryData | null;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();

  // Form states
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [orderIndex, setOrderIndex] = useState(String(initialData?.orderIndex || '0'));
  const [isEnabled, setIsEnabled] = useState(initialData?.isEnabled ?? true);

  // Upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setImageUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImageUrl(data.url);
      } else {
        setImageUploadError(data.error || 'Failed to upload category image');
      }
    } catch {
      setImageUploadError('Network error uploading file');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setErrorMsg('Name and Slug are required parameters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name,
      slug,
      description,
      imageUrl: imageUrl || null,
      orderIndex: Number(orderIndex || 0),
      isEnabled,
    };

    try {
      const url = initialData?.id 
        ? `/api/admin/categories/${initialData.id}`
        : '/api/admin/categories';
      
      const method = initialData?.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(initialData?.id ? 'Category updated successfully!' : 'Category created successfully!');
        setTimeout(() => {
          router.push('/admin/categories');
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Failed to save category information.');
      }
    } catch {
      setErrorMsg('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">
          {initialData ? 'Edit Category Parameters' : 'New Category Structure'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Category Name"
            placeholder="e.g. Mug Printing"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label="URL Slug"
            placeholder="e.g. mug-printing"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Brief summary of items in this category"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Sort Order Index"
            type="number"
            placeholder="0"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5 justify-center">
            <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Category Status</label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
              />
              <span className="text-xs font-semibold text-dark">Enable Category on Storefront</span>
            </label>
          </div>
        </div>

        {/* Category Image uploader */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-bg-light/40 border border-gray-border p-4 rounded-xl">
          <div className="space-y-2">
            <Input
              label="Category Preview Image URL"
              placeholder="e.g. /secure_uploads/... or external link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Upload Image (JPG/PNG/WEBP)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white border border-gray-border hover:border-primary px-4 py-2 rounded-lg text-xs font-bold text-dark flex items-center gap-1.5 transition-all select-none hover:text-primary">
                  <UploadCloud size={16} className="text-primary" />
                  {isUploadingImage ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
                {isUploadingImage && <span className="text-[10px] text-gray-text animate-pulse">Uploading...</span>}
                {imageUploadError && <span className="text-[10px] text-accent-red font-bold">{imageUploadError}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-32 h-32 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-gray-text text-center px-2 font-semibold">No Image Selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-accent-red border border-red-100 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <Check size={16} className="bg-green-700 text-white rounded-full p-0.5" /> {successMsg}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="font-bold text-xs gap-1"
          isLoading={loading}
        >
          <Save size={16} /> {initialData ? 'Update Category' : 'Save Category'}
        </Button>
        <Link href="/admin/categories">
          <Button type="button" variant="outline" size="md" className="font-bold text-xs">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
