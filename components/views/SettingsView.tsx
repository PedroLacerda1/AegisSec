'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Radio,
  Save,
  CheckCircle,
  Database,
  Download,
  Copy,
  Terminal,
  RefreshCw,
  Layers,
  Check,
} from 'lucide-react';

interface DbStats {
  engine: string;
  host: string;
  dbName: string;
  supabaseConfigured: boolean;
  counts: {
    vulnerabilities: number;
    remediationTasks: number;
    playbooks: number;
    auditLogs: number;
    users: number;
  };
}

export function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [cisaSyncMinutes, setCisaSyncMinutes] = useState(4);
  const [cvssThreshold, setCvssThreshold] = useState(9.0);
  const [autoQuarantineZeroDay, setAutoQuarantineZeroDay] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/secops-bridge');

  // Supabase & DB integration state
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [migrationSql, setMigrationSql] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  const refreshStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success && data.database) {
        setDbStats(data.database);
      }
    } catch (e) {
      console.error('Failed to fetch DB stats:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.database) {
          setDbStats(data.database);
        }
      })
      .catch((e) => console.error('Failed to fetch DB stats:', e));

    fetch('/api/export-sql')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.migrationSql) {
          setMigrationSql(data.migrationSql);
        }
      })
      .catch((e) => console.error('Failed to fetch migration SQL:', e));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopySql = () => {
    if (!migrationSql) return;
    navigator.clipboard.writeText(migrationSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadMigration = () => {
    if (!migrationSql) return;
    const blob = new Blob([migrationSql], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '20261110000000_initial_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-2xs">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                POLÍTICAS & INTEGRAÇÕES
              </span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700">
                POSTGRESQL & SUPABASE ACTIVE
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Configurações de Defesa e Banco de Dados
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saved ? 'Configurações Salvas' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Supabase & Database Architecture Card */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 p-6 shadow-2xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Integração Supabase & Cloud SQL (PostgreSQL)</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tabelas operacionais sincronizadas, DDL compatível com Supabase CLI e Drizzle ORM.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refreshStats}
              disabled={loadingStats}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loadingStats ? 'animate-spin' : ''}`} />
              <span>Atualizar Métricas</span>
            </button>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copiedSql ? 'Copiado!' : 'Copiar Migration SQL'}</span>
            </button>
            <button
              onClick={handleDownloadMigration}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar Migration (.sql)</span>
            </button>
          </div>
        </div>

        {/* Database Stats & Tables Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CVEs Cadastrados</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {dbStats?.counts?.vulnerabilities ?? 6}
              </span>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold">tabela: vulnerabilities</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Planos de Remediação</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {dbStats?.counts?.remediationTasks ?? 6}
              </span>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold">tabela: remediation_tasks</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SOAR Playbooks</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {dbStats?.counts?.playbooks ?? 3}
              </span>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold">tabela: playbooks</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Logs de Auditoria</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {dbStats?.counts?.auditLogs ?? 3}
              </span>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold">tabela: audit_logs</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Operadores Ativos</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {dbStats?.counts?.users ?? 3}
              </span>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold">tabela: users</span>
            </div>
          </div>
        </div>

        {/* Supabase CLI Command Quick Reference */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-900 p-4 text-xs font-mono text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-white">Comandos Supabase CLI para envio de Migrations</span>
            </div>
            <button
              onClick={() => setShowSqlViewer(!showSqlViewer)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-sans font-semibold cursor-pointer"
            >
              {showSqlViewer ? 'Ocultar Código SQL' : 'Visualizar Código SQL'}
            </button>
          </div>
          <div className="space-y-1 text-slate-300">
            <p><span className="text-emerald-400 font-bold"># 1. Vincular ao seu projeto Supabase na nuvem:</span></p>
            <p className="text-slate-100 bg-slate-950/80 px-2 py-1 rounded">supabase link --project-ref &lt;seu-project-id&gt;</p>
            <p className="pt-2"><span className="text-emerald-400 font-bold"># 2. Aplicar a migration gerada em supabase/migrations/:</span></p>
            <p className="text-slate-100 bg-slate-950/80 px-2 py-1 rounded">supabase db push</p>
          </div>

          {showSqlViewer && (
            <div className="mt-4 border-t border-slate-800 pt-3">
              <div className="text-[11px] text-slate-400 mb-2">Arquivo: supabase/migrations/20261110000000_initial_schema.sql</div>
              <pre className="max-h-60 overflow-y-auto rounded bg-slate-950 p-3 text-[11px] leading-relaxed text-emerald-300 font-mono">
                {migrationSql || '-- Carregando arquivo de migração...'}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Policy Thresholds */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Limiares de Escalonamento Automático</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">
                Gatilho CVSS para Quarentena Emergencial:
              </label>
              <div className="mt-1 flex items-center gap-3 font-mono">
                <input
                  type="range"
                  min="7.0"
                  max="10.0"
                  step="0.1"
                  value={cvssThreshold}
                  onChange={(e) => setCvssThreshold(parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-900">
                  CVSS {cvssThreshold.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <div className="font-semibold text-slate-800">Auto-Quarentena em Zero-Day</div>
                <div className="text-[11px] text-slate-500">Isola tráfego WAN no primeiro indicador de exploit em memória</div>
              </div>
              <input
                type="checkbox"
                checked={autoQuarantineZeroDay}
                onChange={(e) => setAutoQuarantineZeroDay(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Threat Feeds & Connectors */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Radio className="h-4 w-4 text-blue-600" />
            <span>Feeds de Inteligência de Ameaças</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">
                Frequência de Sincronização NIST NVD & CISA KEV (Minutos):
              </label>
              <input
                type="number"
                value={cisaSyncMinutes}
                onChange={(e) => setCisaSyncMinutes(parseInt(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">
                Webhook de Alerta Crítico (Slack/Discord/Teams):
              </label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
