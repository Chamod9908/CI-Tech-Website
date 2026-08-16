import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getClientIp } from '@/lib/ip';

interface AuditLogOptions {
  userId?: string | null;
  action: string;
  details?: string;
  req?: NextRequest;
  ipAddress?: string;
}

/**
 * Creates an AuditLog record in database capturing user activity and client IP.
 */
export async function logAudit({ userId, action, details, req, ipAddress }: AuditLogOptions) {
  try {
    const resolvedIp = ipAddress || (req ? getClientIp(req) : '127.0.0.1');

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        details: details || null,
        ipAddress: resolvedIp,
      },
    });
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
}
