'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/';
      } else {
        setErrorMsg(data.error || 'Failed to register account.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-gray-border rounded-2xl shadow-lg">
        
        {/* Header Block */}
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-extrabold text-2xl tracking-tight text-dark flex items-center gap-1">
              <span className="text-primary font-black">C.I.</span>
              <span>Technologies &amp;</span>
              <span className="text-primary font-black">Color</span>
              <span className="text-red-600 font-black">Lab</span>
            </span>
            <span className="text-[10px] text-primary font-extrabold tracking-widest uppercase mt-1">
              #colorlab99 <span className="text-gray-400 font-normal lowercase tracking-normal">| Experience The Excellence</span>
            </span>
          </Link>
          <h2 className="mt-6 text-xl font-extrabold text-dark tracking-tight">Create Customer Account</h2>
          <p className="mt-2 text-xs text-gray-text">
            Upload custom prints, save favorite frames, and manage your billing invoices.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="bg-red-50 text-accent-red border border-red-100 p-3 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g., Ishan Liyanaarachchi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g., ishan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g., 0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
              Register Account
            </Button>
          </div>
        </form>

        {/* Footer actions */}
        <div className="text-center pt-2">
          <span className="text-xs text-gray-text">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-hover font-bold">
              Sign In
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
