'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
} from 'lucide-react';
import { AUDIT_LOGS_DATA, AuditLog } from '@/lib/cyber-data';

export function AuditLogsView() {
  const [logs, setLogs] = useState<AuditLog[]>(AUDIT_LOGS_DATA);
  const [query, setQuery] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(query.toLowerCase()) ||
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.target.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-2xs">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                GOVERNANÇA & CONFORMIDADE
              </span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700 border border-emerald-200/50">
                WORM IMMUTABLE
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Logs de Auditoria de Segurança
            </h1>
          </div>
        </div>

        <button
          onClick={() => {
            const content = JSON.stringify(logs, null, 2);
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${Date.now()}.json`;
            a.click();
          }}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <FileDown className="h-4 w-4 text-slate-500" />
          <span>Exportar Trilha JSON/CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar por ator, ação executada ou alvo..."
          className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
        />
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">DATA / HORA</th>
              <th className="px-4 py-3">OPERADOR / ATOR</th>
              <th className="px-4 py-3">AÇÃO EXECUTADA</th>
              <th className="px-4 py-3">ALVO AFETADO</th>
              <th className="px-4 py-3">RESULTADO</th>
              <th className="px-4 py-3">HASH CRIPTOGRÁFICO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 text-slate-500">{l.timestamp}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{l.actor}</td>
                <td className="px-4 py-3 text-slate-800">{l.action}</td>
                <td className="px-4 py-3 text-blue-600">{l.target}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold ${
                      l.result === 'SUCCESS'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {l.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-[10px] text-slate-400">{l.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
