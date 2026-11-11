'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileDown,
  TrendingUp,
  AlertTriangle,
  Flag,
  CheckCircle,
  Clock,
  Radio,
  ExternalLink,
  Zap,
  KeyRound,
  Sliders,
  Server,
  Cloud,
  Layers,
  Laptop,
  Database,
  Crosshair,
  AlertOctagon,
  Power,
  ChevronRight,
} from 'lucide-react';

interface SecurityPostureViewProps {
  onNavigateToView: (view: string, cveId?: string) => void;
  onExecutePatch: (taskTitle: string, target: string) => void;
  onIsolateHost: (hostname: string, ip: string) => void;
  onExportDossier: () => void;
}

export function SecurityPostureView({
  onNavigateToView,
  onExecutePatch,
  onIsolateHost,
  onExportDossier,
}: SecurityPostureViewProps) {
  const [timeRange, setTimeRange] = useState<'30D' | '60D' | '90D'>('30D');
  const [reconSeconds, setReconSeconds] = useState(42);
  const [revokedKey, setRevokedKey] = useState(false);
  const [mitigatedTls, setMitigatedTls] = useState(false);
  const [kubePatched, setKubePatched] = useState(false);

  // Live timer for recon seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setReconSeconds((prev) => (prev > 90 ? 10 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trajectory datasets based on timeRange
  const trajectoryData = {
    '30D': [
      { label: 'D-30', score: 58 },
      { label: 'D-20', score: 66 },
      { label: 'D-10', score: 73 },
      { label: 'HOJE', score: 78 },
    ],
    '60D': [
      { label: 'D-60', score: 49 },
      { label: 'D-40', score: 58 },
      { label: 'D-20', score: 66 },
      { label: 'HOJE', score: 78 },
    ],
    '90D': [
      { label: 'D-90', score: 42 },
      { label: 'D-60', score: 55 },
      { label: 'D-30', score: 68 },
      { label: 'HOJE', score: 78 },
    ],
  }[timeRange];

  return (
    <div className="space-y-6 p-6">
      {/* 1. Header Card: Executive CISO View */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-600 shadow-2xs">
            <Shield className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                VISÃO EXECUTIVA CISO
              </span>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-600 uppercase border border-blue-200/50">
                EM TEMPO REAL
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Postura de Segurança & Riscos
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* SOC Cluster Tag */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 font-mono">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>SOC CLUSTER: <strong className="font-bold text-slate-900">SAO-PAULO-01</strong></span>
          </div>

          {/* Last Recon Tag */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>ÚLTIMO RECON: <strong className="font-bold text-slate-900">HÁ {reconSeconds} SEGUNDOS</strong></span>
          </div>

          {/* Export Dossier Button */}
          <button
            onClick={onExportDossier}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5 text-slate-500" />
            <span>EXPORTAR DOSSIÊ</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Metric 1: Resiliência Global */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              RESILIÊNCIA GLOBAL
            </span>
            {/* Circular Gauge */}
            <div className="relative flex h-8 w-8 items-center justify-center">
              <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 transition-all duration-1000"
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-blue-700 font-mono">
                78%
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">78</span>
            <span className="text-xs font-semibold text-slate-400 font-mono">/100</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+4 pts</span>
              <span className="text-slate-400 font-normal">(7 dias)</span>
            </div>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
              MODERADO
            </span>
          </div>

          <div className="mt-2.5 border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>SLA Resposta Médio:</span>
            <span className="font-bold text-slate-700">18m 42s</span>
          </div>
        </div>

        {/* Metric 2: Vulnerabilidades Críticas */}
        <div className="rounded-xl border border-rose-200/70 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-rose-600 uppercase">
              VULNERABILIDADES CRÍTICAS
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60">
              <Power className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">14</span>
            <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-700 border border-rose-200/60">
              +2 hoje
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">EXPOSIÇÃO ZERO-DAY:</span>
              <span className="font-bold text-rose-600">ATIVA (1)</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-rose-500" style={{ width: '75%' }} />
            </div>
          </div>
        </div>

        {/* Metric 3: Vulnerabilidades Altas */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              VULNERABILIDADES ALTAS
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">42</span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 border border-amber-200/60">
              -5 semana
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">PATCH SLA EM RISCO:</span>
              <span className="font-bold text-amber-600">3 instâncias</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-amber-500" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* Metric 4: Vulnerabilidades Médias */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              VULNERABILIDADES MÉDIAS
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Flag className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">128</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
              Estável
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">BACKLOG REMEDIAÇÃO:</span>
              <span className="font-bold text-slate-700">68 resolvidas</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-400" style={{ width: '53%' }} />
            </div>
          </div>
        </div>

        {/* Metric 5: Ativos Protegidos */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              ATIVOS PROTEGIDOS
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">99.4%</span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">TOTAL MONITORADOS:</span>
              <span className="font-bold text-slate-800">1.420 nós</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>T1: 240</span>
              <span>T2: 680</span>
              <span>T3: 500</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Hero Spotlight Card & Attack Surface */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Active Threat Spotlight & Trajectory */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Zero-Day Banner */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-5 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                    ALERTA ZERO-DAY ATIVO
                  </span>
                  <span className="rounded bg-rose-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                    CVSS 10.0 CRITICAL MAX
                  </span>
                  <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                    CVE-2024-3400
                  </span>
                </div>

                <h3 className="mt-2 text-base font-extrabold text-slate-900">
                  Injeção de Comando em Palo Alto GlobalProtect OS
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onIsolateHost('fw-edge-sp01.corp', '198.51.100.44')}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700 cursor-pointer"
                >
                  <AlertOctagon className="h-3.5 w-3.5" />
                  <span>Isolar Tráfego Host</span>
                </button>
                <button
                  onClick={() => onNavigateToView('assets-cves', 'CVE-2024-3400')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                  <span>Ver Análise Forense</span>
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Detectada tentativa de execução arbitrária remota com privilégios de root no gateway perimetral primário. Vetor de persistência identificado em memória volátil.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  ALVO AFETADO
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-slate-900">
                  fw-edge-sp01.corp
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  ENDEREÇO IP
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-slate-900">
                  198.51.100.44
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  VETOR DE ATAQUE
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-rose-600">
                  Exploit Remoto WAN
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Telemetry Trend Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    TELEMETRIA PREDITIVA
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    34% Redução de Exposição
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Trajetória de Risco & Postura ({timeRange === '30D' ? '30 Dias' : timeRange === '60D' ? '60 Dias' : '90 Dias'})
                </h3>
              </div>

              {/* Range Selector */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                {(['30D', '60D', '90D'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-all cursor-pointer ${
                      timeRange === r
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="mt-6">
              <div className="relative h-44 w-full">
                <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 120">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline */}
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="110" x2="600" y2="110" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Shaded Area */}
                  <path
                    d={`M 15 110 L 15 100 Q 180 75, 230 65 T 420 40 T 585 24 L 585 110 Z`}
                    fill="url(#areaGradient)"
                  />

                  {/* Smooth Trend Curve Line */}
                  <path
                    d="M 15 100 C 120 90, 180 70, 230 65 C 310 58, 360 46, 420 40 C 490 32, 540 26, 585 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  <circle cx="15" cy="100" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                  <circle cx="230" cy="65" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                  <circle cx="420" cy="40" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />

                  {/* Glowing Active Point on Current Score */}
                  <circle cx="585" cy="24" r="5" fill="#2563eb" />
                  <circle cx="585" cy="24" r="8" fill="#2563eb" opacity="0.3" className="animate-ping" />
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500">
                {trajectoryData.map((d, i) => (
                  <div
                    key={d.label}
                    className={`text-center ${
                      i === trajectoryData.length - 1 ? 'font-bold text-blue-600' : ''
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">{d.label}</div>
                    <div className="mt-0.5 text-xs text-slate-800">
                      Índice: <strong className="font-bold">{d.score}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Superfície de Ataque */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                VETOR DE EXPOSIÇÃO
              </span>
              <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                4 VETORES
              </span>
            </div>

            <h3 className="mt-1 text-base font-extrabold text-slate-900">
              Superfície de Ataque
            </h3>

            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Distribuição proporcional da área de ameaça com base nas análises de vulnerabilidades abertas por ambiente.
            </p>

            <div className="mt-5 space-y-4">
              {/* Vector 1 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-blue-500" />
                    <span>Cloud AWS & Azure Multi-Reg</span>
                  </div>
                  <span className="font-mono font-bold">44%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: '44%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>625 Instâncias EC2/AKS</span>
                  <span className="text-slate-600 font-semibold">18 CVEs Abertas</span>
                </div>
              </div>

              {/* Vector 2 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-600" />
                    <span>API Gateways & Microsserviços</span>
                  </div>
                  <span className="font-mono font-bold">28%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-cyan-600" style={{ width: '28%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>398 Endpoints Rest/gRPC</span>
                  <span className="text-slate-600 font-semibold">9 CVEs Abertas</span>
                </div>
              </div>

              {/* Vector 3 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-slate-600" />
                    <span>Endpoints Corporativos EDR</span>
                  </div>
                  <span className="font-mono font-bold">18%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-600" style={{ width: '18%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>2.180 Agentes CrowdStrike</span>
                  <span className="text-slate-600 font-semibold">12 CVEs Abertas</span>
                </div>
              </div>

              {/* Vector 4 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-rose-500" />
                    <span>Infra Legada On-Premise</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600">10%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: '10%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>Datacenter Tamboré</span>
                  <span className="text-rose-600 font-semibold">14 CVEs Abertas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shodan / Cortex notice */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-500 flex items-center gap-2 font-mono">
            <Radio className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>Superfície monitorada continuamente via Shodan Monitor & Cortex Xpanse.</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Ações Prioritárias Pendentes */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                DISPARO RÁPIDO DE CONTRAMEDIDAS
              </span>
              <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                3 AÇÕES CRÍTICAS
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Ações Prioritárias Pendentes
            </h3>
          </div>

          <div className="font-mono text-xs text-slate-500">
            ORDENADO POR: <strong className="font-bold text-slate-800">IMPACTO DE REDUÇÃO DE RISCO</strong>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* Action 1 */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-2xs md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200/50">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Patch Kube-Proxy v1.28.2
                  </h4>
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-700">
                    CRÍTICO
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-blue-600">
                    CVE-2023-5528
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Mitiga vulnerabilidade de bypass de autorização RBAC e escalonamento de privilégio. Afeta diretamente o pool de produção em São Paulo.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 font-mono text-[10px] text-slate-400">
                  <span>ALVO: <strong className="text-slate-700 font-semibold">8 Nós Kubernetes (k8s-prod-worker-*)</strong></span>
                  <span>TEMPO DE DOWNTIME ESTIMADO: <strong className="text-emerald-600 font-semibold">0s (Rolling)</strong></span>
                </div>
              </div>
            </div>

            <div className="shrink-0 self-end md:self-center">
              <button
                disabled={kubePatched}
                onClick={() => {
                  setKubePatched(true);
                  onExecutePatch('Patch Kube-Proxy v1.28.2', '8 Nós Kubernetes (k8s-prod-worker-*)');
                }}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                  kubePatched
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>{kubePatched ? 'Patch Aplicado' : 'Patch Instantâneo'}</span>
              </button>
            </div>
          </div>

          {/* Action 2 */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-2xs md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200/50">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Revogar Chave SSH DevOps Desalinhada
                  </h4>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-700">
                    ALTO
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                    POLÍTICA SEC-IAM-404
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Chave RSA de 4096-bit associada ao usuário de automação <code className="font-mono bg-slate-100 px-1 rounded text-slate-800">deployer-auto</code> expirada há 14 dias com acesso de root preservado.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 font-mono text-[10px] text-slate-400">
                  <span>LOCALIZAÇÃO: <strong className="text-slate-700 font-semibold">bastion-core-01.sa-east-1</strong></span>
                  <span>CONEXÕES ATIVAS: <strong className="text-rose-600 font-semibold">{revokedKey ? '0 sessões (Revogado)' : '1 sessão SSH'}</strong></span>
                </div>
              </div>
            </div>

            <div className="shrink-0 self-end md:self-center">
              <button
                disabled={revokedKey}
                onClick={() => setRevokedKey(true)}
                className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                  revokedKey
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default'
                    : 'border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{revokedKey ? 'Acesso Revogado' : 'Revogar Acesso'}</span>
              </button>
            </div>
          </div>

          {/* Action 3 */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-2xs md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200/50">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Desativar Ciphers Débeis TLS 1.0/1.1
                  </h4>
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-700">
                    MÉDIO
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                    COMPLIANCE PCI-DSS 4.0
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Criptografia obsoleta CBC detectada em negociações SSL/TLS. Restringir rigorosamente para TLS 1.3 e AEAD suites modernos.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 font-mono text-[10px] text-slate-400">
                  <span>ALVO: <strong className="text-slate-700 font-semibold">Ingress Gateway de Pagamentos (pay-gw.aegis.bank)</strong></span>
                  <span>CERTIFICADO: <strong className="text-slate-700 font-semibold">DigiCert EV RSA 4096</strong></span>
                </div>
              </div>
            </div>

            <div className="shrink-0 self-end md:self-center">
              <button
                disabled={mitigatedTls}
                onClick={() => setMitigatedTls(true)}
                className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                  mitigatedTls
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{mitigatedTls ? 'Ciphers Mitigados' : 'Mitigar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
