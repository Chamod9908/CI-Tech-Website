import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
    }

    // 1. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    // 2. Compare password hashes
    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    // 3. Establish JWT cookie session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
