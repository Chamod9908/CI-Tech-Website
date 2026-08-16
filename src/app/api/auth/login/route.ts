import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanPassword = password ? String(password).trim() : '';

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
    }

    // 1. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive) {
      await logAudit({
        action: 'LOGIN_FAILED',
        details: `Failed authentication attempt for email: ${cleanEmail}`,
        req,
      });
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    // 2. Compare password hashes
    const match = await comparePassword(cleanPassword, user.passwordHash);
    if (!match) {
      await logAudit({
        userId: user.id,
        action: 'LOGIN_FAILED',
        details: `Incorrect password attempt for user: ${user.email}`,
        req,
      });
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    // 3. Establish JWT cookie session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 4. Log successful authentication in AuditLog with client IP
    await logAudit({
      userId: user.id,
      action: 'USER_LOGIN',
      details: `Successful sign-in as ${user.role} (${user.email})`,
      req,
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
