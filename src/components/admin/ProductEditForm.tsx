'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Plus, Trash2, Save, ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';

interface CategoryType {
  id: string;
  name: string;
}

interface OptionValueInput {
  value: string;
  priceAdjustment: string;
}

interface OptionInput {
  name: string;
  values: OptionValueInput[];
}

interface ProductType {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  costPrice: number;
  salePrice?: number | null;
  stock: number;
  lowStockThreshold: number;
  imageUrl?: string | null;
  options: {
    name: string;
    values: {
      value: string;
      priceAdjustment: number;
    }[];
  }[];
}

interface ProductEditFormProps {
  product: ProductType;
  categories: CategoryType[];
}

export default function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();

  // Pre-loaded fields
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [description, setDescription] = useState(product.description);
  const [shortDescription, setShortDescription] = useState(product.shortDescription || '');
  const [price, setPrice] = useState(String(product.price));
  const [costPrice, setCostPrice] = useState(String(product.costPrice));
  const [salePrice, setSalePrice] = useState(product.salePrice ? String(product.salePrice) : '');
  const [stock, setStock] = useState(String(product.stock));
  const [lowStockThreshold, setLowStockThreshold] = useState(String(product.lowStockThreshold));
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');

  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

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
        setImageUploadError(data.error || 'Failed to upload image');
      }
    } catch {
      setImageUploadError('Network error uploading file');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Pre-loaded dynamic Options state
  const [options, setOptions] = useState<OptionInput[]>(() => {
    return product.options.map((o) => ({
      name: o.name,
      values: o.values.map((v) => ({
        value: v.value,
        priceAdjustment: String(v.priceAdjustment),
      })),
    }));
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddOption = () => {
    setOptions([...options, { name: '', values: [{ value: '', priceAdjustment: '0' }] }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionNameChange = (index: number, val: string) => {
    const next = [...options];
    next[index].name = val;
    setOptions(next);
  };

  const handleAddValue = (optIndex: number) => {
    const next = [...options];
    next[optIndex].values.push({ value: '', priceAdjustment: '0' });
    setOptions(next);
  };

  const handleRemoveValue = (optIndex: number, valIndex: number) => {
    const next = [...options];
    next[optIndex].values = next[optIndex].values.filter((_, i) => i !== valIndex);
    setOptions(next);
  };

  const handleValueChange = (optIndex: number, valIndex: number, field: keyof OptionValueInput, val: string) => {
    const next = [...options];
    next[optIndex].values[valIndex][field] = val;
    setOptions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          sku,
          categoryId,
          description,
          shortDescription,
          price,
          costPrice,
          salePrice,
          stock,
          lowStockThreshold,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
          options,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Product details updated successfully in catalog.');
        setTimeout(() => {
          router.push('/admin/products');
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Failed to update product.');
      }
    } catch (err) {
      setErrorMsg('Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic product specifications */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Product Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            placeholder="e.g. Premium Anti-Glare Wooden Frame"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="SKU Reference ID"
            placeholder="e.g. CI-FRAME-002"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Category Mapping</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-border rounded-lg px-3 py-2 text-xs bg-white text-dark focus:outline-none focus:border-primary font-semibold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Cost Price (Rs.)"
            type="number"
            placeholder="e.g. 500"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            required
          />
          <Input
            label="Regular Price (Rs.)"
            type="number"
            placeholder="e.g. 1000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="Sale Price (Rs.) [Optional]"
            type="number"
            placeholder="e.g. 850 (Or blank)"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Opening Inventory Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <Input
            label="Low Stock Warning Alert Threshold"
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-bg-light/40 border border-gray-border p-4 rounded-xl">
          <div className="space-y-2">
            <Input
              label="Display Image URL"
              placeholder="e.g. https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Or Upload Local Image File</label>
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
                <span className="text-[10px] text-gray-text text-center px-2">No Image Selected</span>
              )}
            </div>
          </div>
        </div>

        <Input
          label="Short Description"
          placeholder="Summary coordinates shown on grid hover..."
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />

        <Textarea
          label="Full Specifications / Product Description"
          placeholder="Enter details on print dimensions, photo specs, wooden boundaries..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Dynamic pricing variables / attributes */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest">Customizable Options & Variants</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="text-xs font-bold gap-1 py-1">
            <Plus size={14} /> Add Option (e.g. Size, Matte)
          </Button>
        </div>

        {options.length === 0 ? (
          <p className="text-xs text-gray-text italic">
            This product currently has no customizable attributes. Click &quot;Add Option&quot; above to build print options.
          </p>
        ) : (
          <div className="space-y-6">
            {options.map((opt, optIdx) => (
              <div key={optIdx} className="border border-gray-200 rounded-xl p-4 bg-bg-light/40 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Input
                    label={`Option Name #${optIdx + 1}`}
                    placeholder="e.g. Frame Size, Paper Finish"
                    value={opt.name}
                    onChange={(e) => handleOptionNameChange(optIdx, e.target.value)}
                    className="max-w-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(optIdx)}
                    className="text-gray-text hover:text-accent-red p-1.5 hover:bg-gray-100 rounded-full transition-all mt-4"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Values table */}
                <div className="space-y-2 pl-4 border-l border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider">Option Values & Price Adjustments</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddValue(optIdx)} className="text-[10px] py-0.5 px-2 font-bold gap-1">
                      <Plus size={10} /> Add Value
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {opt.values.map((val, valIdx) => (
                      <div key={valIdx} className="flex gap-4 items-center">
                        <Input
                          placeholder="e.g. 8x12 inches, Glossy"
                          value={val.value}
                          onChange={(e) => handleValueChange(optIdx, valIdx, 'value', e.target.value)}
                          required
                        />
                        <Input
                          label="Price Adjustment (Rs.)"
                          type="number"
                          placeholder="e.g. +150 (use - for reduction)"
                          value={val.priceAdjustment}
                          onChange={(e) => handleValueChange(optIdx, valIdx, 'priceAdjustment', e.target.value)}
                          required
                        />
                        {opt.values.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveValue(optIdx, valIdx)}
                            className="text-gray-text hover:text-accent-red p-1.5 hover:bg-gray-100 rounded-full transition-all mt-4"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages feedback */}
      {errorMsg && (
        <div className="bg-red-50 text-accent-red border border-red-100 p-3 rounded-lg text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Save coordinates */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="font-bold text-xs gap-1"
          isLoading={isLoading}
        >
          <Save size={16} /> Save Changes
        </Button>
        <Link href="/admin/products">
          <Button type="button" variant="outline" size="lg" className="font-bold text-xs">
            Cancel
          </Button>
        </Link>
      </div>

    </form>
  );
}
