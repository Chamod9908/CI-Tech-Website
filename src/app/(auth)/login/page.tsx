'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect based on user role
        if (data.user.role !== 'CUSTOMER') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMsg(data.error || 'Invalid login details.');
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
            <span className="font-extrabold text-2xl tracking-tight text-dark">
              <span className="text-primary font-black">C.I.</span> Technologies
            </span>
            <span className="text-[10px] text-gray-text font-bold tracking-widest uppercase mt-1">
              COLOR LAB & STUDIO
            </span>
          </Link>
          <h2 className="mt-6 text-xl font-extrabold text-dark tracking-tight">Sign In to Your Account</h2>
          <p className="mt-2 text-xs text-gray-text">
            Access your orders, track custom designs, and update your framing layouts.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="bg-red-50 text-accent-red border border-red-100 p-3 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g., ishan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>

        {/* Footer actions */}
        <div className="text-center pt-2">
          <span className="text-xs text-gray-text">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary-hover font-bold">
              Register Here
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
