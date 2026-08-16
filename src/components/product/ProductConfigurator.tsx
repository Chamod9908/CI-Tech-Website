'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Button from '@/components/ui/Button';
import { UploadCloud, Check, X, FileText, Image as ImageIcon, ExternalLink, Eye } from 'lucide-react';

interface ValueType {
  id: string;
  value: string;
  priceAdjustment: number | string;
}

interface OptionType {
  id: string;
  name: string;
  isRequired: boolean;
  values: ValueType[];
}

interface ProductType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  price: number | string;
  salePrice?: number | string | null;
  images: { id: string; url: string }[];
  options: OptionType[];
}

interface ProductConfiguratorProps {
  product: ProductType;
}

interface UploadedFile {
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const { addToCart } = useStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { value: string; priceAdjustment: number }>>(() => {
    const defaults: Record<string, { value: string; priceAdjustment: number }> = {};
    product.options.forEach((opt) => {
      // Auto-select initial value only if option is required
      if (opt.isRequired && opt.values && opt.values.length > 0) {
        defaults[opt.name] = {
          value: opt.values[0].value,
          priceAdjustment: Number(opt.values[0].priceAdjustment),
        };
      }
    });
    return defaults;
  });
  const [quantity, setQuantity] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [activeImage, setActiveImage] = useState(product.images[0]?.url || '');
  const [successMsg, setSuccessMsg] = useState('');

  const basePrice = Number(product.salePrice || product.price);

  // Calculate current unit price
  const optionAdjustments = Object.values(selectedOptions).reduce(
    (acc, opt) => acc + opt.priceAdjustment,
    0
  );
  const currentUnitPrice = basePrice + optionAdjustments;
  const totalPrice = currentUnitPrice * quantity;

  const handleOptionChange = (opt: OptionType, valueStr: string, priceAdjustment: number) => {
    setSelectedOptions((prev) => {
      const isCurrentlySelected = prev[opt.name]?.value === valueStr;
      // Allow deselecting/toggling off if optional or if clicking active choice
      if (isCurrentlySelected && (!opt.isRequired || valueStr.toLowerCase().includes('none'))) {
        const copy = { ...prev };
        delete copy[opt.name];
        return copy;
      }
      return {
        ...prev,
        [opt.name]: { value: valueStr, priceAdjustment },
      };
    });
  };

  // Drag & drop file upload
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadError('');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          const newFile: UploadedFile = {
            filename: data.filename,
            fileType: data.fileType,
            fileSize: data.fileSize,
            url: data.url,
          };
          setUploadedFiles((prev) => [...prev, newFile]);

          // Immediately display the uploaded image on the product preview!
          if (data.url && (data.fileType?.includes('image') || file.type.startsWith('image/') || data.url.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i))) {
            setActiveImage(data.url);
          }
        } else {
          setUploadError(data.error || 'Failed to upload file');
        }
      } catch (e) {
        setUploadError('Network error uploading file');
      }
    }
    setIsUploading(false);
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileToRemove && fileToRemove.url === activeImage) {
      setActiveImage(product.images[0]?.url || '');
    }
  };

  const handleAddToCart = () => {
    // Check required options selection
    const missingRequiredOpt = product.options.find(
      (opt) => opt.isRequired && !selectedOptions[opt.name]
    );
    if (missingRequiredOpt) {
      setUploadError(`Please select a choice for "${missingRequiredOpt.name}".`);
      return;
    }

    // Check if files are uploaded for options that might require them (e.g. photo print)
    const requiresUpload = product.slug.includes('print') || product.slug.includes('mug') || product.slug.includes('frame');
    if (requiresUpload && uploadedFiles.length === 0) {
      setUploadError('Please upload at least one photo or design before adding to cart.');
      return;
    }

    const optionsArray = Object.entries(selectedOptions).map(([option, details]) => ({
      option,
      value: details.value,
      priceAdjustment: details.priceAdjustment,
    }));

    // Generate cart item structure with serialized details
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentUnitPrice,
      quantity,
      image: activeImage,
      selectedOptions: optionsArray,
      specialInstructions: specialInstructions + (uploadedFiles.length > 0 ? ` [Files: ${uploadedFiles.map(f => `${f.filename} (${f.url})`).join(', ')}]` : ''),
    });

    setSuccessMsg('Product added to your cart successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Image Gallery (Left Panel) */}
      <div className="space-y-4">
        <div className="border border-gray-border rounded-2xl overflow-hidden aspect-square bg-gray-50 flex items-center justify-center relative">
          <img
            src={activeImage || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600'}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 transition-all ${
                  activeImage === img.url ? 'border-primary ring-2 ring-primary/25' : 'border-gray-border'
                }`}
              >
                <img src={img.url} alt="" className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Details Panel (Right Panel) */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">{product.name}</h1>
          <p className="text-xs text-gray-text mt-1.5 uppercase font-bold tracking-wider">SKU: {product.sku}</p>
        </div>

        {/* Pricing Blocks */}
        <div className="bg-bg-light p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-text font-bold uppercase tracking-wider">Unit Price</p>
            <span className="text-2xl font-black text-dark">
              Rs. {currentUnitPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-text font-bold uppercase tracking-wider text-right">Total Price</p>
            <span className="text-2xl font-black text-primary">
              Rs. {totalPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-text leading-relaxed">{product.description}</p>

        {/* Dynamic Product Options selectors */}
        {product.options.map((opt) => (
          <div key={opt.id} className="space-y-2 border-t border-gray-100 pt-4">
            <label className="text-xs font-bold text-dark uppercase tracking-wider block">
              {opt.name} {opt.isRequired && <span className="text-accent-red">*</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((val) => {
                const isSelected = selectedOptions[opt.name]?.value === val.value;
                const adj = Number(val.priceAdjustment);
                const adjText = adj > 0 ? ` (+Rs. ${adj})` : adj < 0 ? ` (-Rs. ${Math.abs(adj)})` : '';
                return (
                  <button
                    key={val.id}
                    onClick={() => handleOptionChange(opt, val.value, adj)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-gray-border text-dark hover:border-dark'
                    }`}
                  >
                    {val.value}
                    {adjText}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Premium File Upload Zone */}
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <label className="text-xs font-bold text-dark uppercase tracking-wider block">
            Upload Custom Photo / Graphic Design <span className="text-accent-red">*</span>
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-gray-border hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-all bg-gray-50 flex flex-col items-center justify-center gap-2"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <UploadCloud size={32} className="text-gray-text group-hover:text-primary" />
            <span className="text-xs font-bold text-dark">Drag & drop files here or click to select</span>
            <span className="text-[10px] text-gray-text">Supports JPG, PNG, PDF, TIFF, PSD, AI (Max 50MB)</span>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>

          {/* Upload Progress / Loading */}
          {isUploading && (
            <div className="text-xs text-primary font-semibold animate-pulse flex items-center gap-1.5 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              Uploading your file...
            </div>
          )}

          {uploadError && (
            <div className="text-xs text-accent-red font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100 mt-2">
              {uploadError}
            </div>
          )}

          {/* Uploaded Files list */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 mt-3">
              <p className="text-[10px] text-gray-text font-bold uppercase tracking-wider">Uploaded Attachments & Previews:</p>
              {uploadedFiles.map((file, idx) => {
                const isImg = file.fileType?.includes('image') || file.url.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i);
                return (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl text-xs font-medium border border-gray-200 gap-2">
                    <div className="flex items-center gap-3 truncate min-w-0">
                      {isImg ? (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-300 shrink-0 cursor-pointer hover:opacity-80 transition-opacity shadow-xs"
                          onClick={() => setActiveImage(file.url)}
                          title="Click to preview on main image"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                          <FileText size={20} className="text-primary" />
                        </div>
                      )}
                      <div className="truncate flex flex-col">
                        <span className="truncate max-w-[150px] sm:max-w-[200px] text-dark font-semibold">{file.filename}</span>
                        <span className="text-[10px] text-gray-text">({(file.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isImg && (
                        <button
                          type="button"
                          onClick={() => setActiveImage(file.url)}
                          className="text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors flex items-center gap-1"
                          title="Set as main display image"
                        >
                          <Eye size={12} /> Preview
                        </button>
                      )}
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-dark p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                        title="Open image in new tab"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-gray-400 hover:text-accent-red p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Special instructions / notes */}
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <label className="text-xs font-bold text-dark uppercase tracking-wider block">
            Special Instructions / Text to Print
          </label>
          <textarea
            placeholder="E.g., Please align centered. Text to print: 'Happy Birthday Appa!'"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full border border-gray-border rounded-lg p-3 text-xs bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary min-h-[70px]"
          />
        </div>

        {/* Quantity selector & Add to Cart button */}
        <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
          <div className="flex items-center border border-gray-border rounded-lg overflow-hidden bg-white select-none">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3.5 py-2 hover:bg-gray-100 text-dark font-black text-sm"
            >
              -
            </button>
            <span className="px-4 py-2 text-sm font-bold text-dark text-center min-w-10">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3.5 py-2 hover:bg-gray-100 text-dark font-black text-sm"
            >
              +
            </button>
          </div>

          <Button onClick={handleAddToCart} variant="primary" size="lg" className="flex-1 font-bold text-base py-3">
            Add to Cart
          </Button>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-bold p-3 rounded-lg flex items-center gap-2 mt-4 animate-fade-in shadow-xs">
            <Check size={18} className="bg-green-700 text-white rounded-full p-0.5" />
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
}
