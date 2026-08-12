'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderFilterSelectProps {
  currentStatus: string;
  statuses: string[];
}

export default function OrderFilterSelect({ currentStatus, statuses }: OrderFilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (val) {
      params.set('status', val);
    } else {
      params.delete('status');
    }
    
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="border border-gray-border rounded-lg text-xs font-semibold px-2 py-1 bg-white text-dark focus:outline-none focus:border-primary"
    >
      <option value="">All Statuses</option>
      {statuses.map((st) => (
        <option key={st} value={st}>
          {st.replace('_', ' ')}
        </option>
      ))}
    </select>
  );
}
