import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, password } = await req.json();

    if (!email || !name || !phone || !password) {
      return NextResponse.json({ error: 'Please fill in all registration fields' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Create user and customer profile inside a database transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: emailLower,
          name,
          passwordHash: hashedPassword,
          role: Role.CUSTOMER,
        },
      });

      const customer = await tx.customer.create({
        data: {
          userId: user.id,
          email: emailLower,
          name,
          phone,
        },
      });

      return { user, customer };
    });

    // 4. Create cookie session
    await createSession({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
