'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ShopSortSelectProps {
  currentSort: string;
}

export default function ShopSortSelect({ currentSort }: ShopSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="bg-white border border-gray-border rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:border-primary text-dark"
    >
      <option value="newest">Newest Arrivals</option>
      <option value="popular">Popularity</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
