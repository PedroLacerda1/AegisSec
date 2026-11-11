'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Shield,
  Server,
  Zap,
  Terminal,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { INITIAL_VULNERABILITIES, PLAYBOOKS_DATA, REMEDIATION_CARDS } from '@/lib/cyber-data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (view: string, cveId?: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectResult }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Close on Escape, Open on '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedVulns = INITIAL_VULNERABILITIES.filter(
    (v) =>
      v.cveId.toLowerCase().includes(query.toLowerCase()) ||
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.hostTarget.hostname.toLowerCase().includes(query.toLowerCase()) ||
      v.hostTarget.ip.includes(query)
  );

  const matchedPlaybooks = PLAYBOOKS_DATA.filter(
    (p) =>
      p.code.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  const matchedTasks = REMEDIATION_CARDS.filter(
    (t) =>
      t.taskCode.toLowerCase().includes(query.toLowerCase()) ||
      t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-20 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ativos, CVEs, IPs, pacotes ou playbooks... (ex: Palo Alto, 10.240, CVE-2024-3400)"
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Vulnerabilities */}
          {matchedVulns.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                Vulnerabilidades & CVEs ({matchedVulns.length})
              </div>
              <div className="space-y-1">
                {matchedVulns.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onSelectResult('assets-cves', v.cveId);
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          Number(v.cvss) >= 9.0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        CVSS {(typeof v.cvss === 'number' ? v.cvss : Number(v.cvss) || 0).toFixed(1)}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{v.cveId} - {v.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          Alvo: {v.hostTarget.hostname} ({v.hostTarget.ip})
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remediation Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                Tarefas de Remediação ({matchedTasks.length})
              </div>
              <div className="space-y-1">
                {matchedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectResult('remediation');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-bold text-slate-900">{t.taskCode}: {t.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">{t.squad}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-blue-600 font-bold">{t.progressPercent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playbooks */}
          {matchedPlaybooks.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                Playbooks SOAR ({matchedPlaybooks.length})
              </div>
              <div className="space-y-1">
                {matchedPlaybooks.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectResult('automations');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Terminal className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="font-bold text-slate-900">{p.code}: {p.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">Trigger: {p.trigger}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">{p.successRate}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedVulns.length === 0 && matchedTasks.length === 0 && matchedPlaybooks.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              Nenhum ativo ou vulnerabilidade encontrada para &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-mono text-slate-400">
          <span>Pressione <kbd className="rounded border bg-white px-1">ESC</kbd> para fechar</span>
          <span>AegisSec Search Engine v4.2</span>
        </div>
      </div>
    </div>
  );
}
