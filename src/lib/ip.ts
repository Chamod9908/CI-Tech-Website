import { NextRequest } from 'next/server';

/**
 * Extracts and cleans the real client IP address from an incoming HTTP request.
 * Handles reverse proxies, load balancers, Cloudflare, and local network IPs.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Check Standard Proxy Headers
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return cleanIp(ips[0]);
    }
  }

  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return cleanIp(xRealIp.trim());
  }

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cleanIp(cfConnectingIp.trim());
  }

  const xClientIp = req.headers.get('x-client-ip');
  if (xClientIp) {
    return cleanIp(xClientIp.trim());
  }

  // 2. NextRequest remote address / fallback
  // @ts-ignore
  const rawIp = req.ip || req.socket?.remoteAddress || '';
  if (rawIp) {
    return cleanIp(rawIp);
  }

  return '127.0.0.1';
}

function cleanIp(ip: string): string {
  let cleaned = ip.trim();
  // Strip IPv6 prefix for IPv4-mapped IPv6 addresses (e.g. ::ffff:192.168.1.10 -> 192.168.1.10)
  if (cleaned.startsWith('::ffff:')) {
    cleaned = cleaned.substring(7);
  }
  // Convert localhost IPv6 to standard IPv4
  if (cleaned === '::1') {
    cleaned = '127.0.0.1';
  }
  return cleaned;
}
