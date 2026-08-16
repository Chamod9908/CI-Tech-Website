import React from 'react';
import { prisma } from '@/lib/db';
import { ShieldCheck, Network, User, Calendar, Activity } from 'lucide-react';

export const revalidate = 0;

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={24} />
            <h1 className="text-2xl font-extrabold text-dark tracking-tight">Security & IP Audit Logs</h1>
          </div>
          <p className="text-xs text-gray-text mt-1">
            Real-time tracking of IP addresses, sign-in sessions, and user activity across local network and internet connections.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-soft-dark text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0">
          <Activity size={16} className="text-primary animate-pulse" />
          <span>{logs.length} Log Entries</span>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-gray-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-light border-b border-gray-border text-[11px] font-extrabold uppercase text-gray-text tracking-wider">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Client IP Address</th>
                <th className="py-3.5 px-5">User / Account</th>
                <th className="py-3.5 px-5">Action Event</th>
                <th className="py-3.5 px-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-border text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-text font-medium">
                    No activity logs recorded yet. Sign in or perform actions to generate audit logs.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSuccess = log.action === 'USER_LOGIN' || log.action === 'USER_REGISTER';
                  const isFailed = log.action === 'LOGIN_FAILED';

                  return (
                    <tr key={log.id} className="hover:bg-bg-light/60 transition-colors">
                      {/* Date / Time */}
                      <td className="py-4 px-5 text-gray-text whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-[11px]">
                          <Calendar size={13} className="text-gray-400 shrink-0" />
                          <span>{new Date(log.createdAt).toLocaleString('en-GB')}</span>
                        </div>
                      </td>

                      {/* Client IP */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-mono font-bold text-[11px] px-2.5 py-1 rounded-md border border-blue-200">
                          <Network size={12} className="text-blue-500 shrink-0" />
                          <span>{log.ipAddress || 'Unknown'}</span>
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="py-4 px-5">
                        {log.user ? (
                          <div>
                            <p className="font-bold text-dark text-xs">{log.user.name}</p>
                            <p className="text-[10px] text-gray-text font-medium">{log.user.email} ({log.user.role})</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-text italic text-xs">
                            <User size={13} />
                            <span>Anonymous / Guest</span>
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isFailed
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-4 px-5 text-gray-600 max-w-md truncate text-xs">
                        {log.details || 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
