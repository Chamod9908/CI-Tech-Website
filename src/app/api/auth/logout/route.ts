import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
  }
}
