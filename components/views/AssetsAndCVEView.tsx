'use client';

import React, { useState, useEffect } from 'react';
import {
  Server,
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
  Zap,
  ShieldX,
  FileDown,
  Terminal,
  ExternalLink,
  Clock,
  Layers,
  Lock,
  Radio,
  FileText,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Vulnerability, INITIAL_VULNERABILITIES } from '@/lib/cyber-data';

interface AssetsAndCVEViewProps {
  selectedCveId?: string;
  onExecutePatch: (title: string, target: string) => void;
  onIsolateHost: (hostname: string, ip: string) => void;
  onExportDossierPdf: () => void;
  onNavigateToView: (view: string) => void;
}

export function AssetsAndCVEView({
  selectedCveId = 'CVE-2024-3400',
  onExecutePatch,
  onIsolateHost,
  onExportDossierPdf,
  onNavigateToView,
}: AssetsAndCVEViewProps) {
  const activeCveId = selectedCveId;
  const [copiedVector, setCopiedVector] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [hostIsolated, setHostIsolated] = useState(false);

  // SLA countdown timer (01h 14m 22s)
  const [remainingSeconds, setRemainingSeconds] = useState(1 * 3600 + 14 * 60 + 22);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Find target vulnerability
  const currentVuln =
    INITIAL_VULNERABILITIES.find((v) => v.cveId === activeCveId) ||
    INITIAL_VULNERABILITIES[1]; // fallback to CVE-2024-3400

  const handleCopyVector = () => {
    navigator.clipboard?.writeText(currentVuln.cvssVector);
    setCopiedVector(true);
    setTimeout(() => setCopiedVector(false), 2000);
  };

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText(currentVuln.mitigationLayer2.command);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 1. Breadcrumbs & Top Status Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => onNavigateToView('vuln-hub')}
            className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <Server className="h-3.5 w-3.5" />
            <span>Ativos</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">
            {currentVuln.hostTarget.hostname}
          </span>
          <span className="text-slate-300">/</span>
          <span className="rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-700 border border-rose-200">
            {currentVuln.cveId}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/70 px-3 py-1 text-rose-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>INCIDENTE ATIVO #SEC-9842</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-slate-600 font-medium">
            FEED: <strong className="text-slate-900 font-bold">RECON_PROBE_AWS_SA</strong>
          </div>
        </div>
      </div>

      {/* 2. Host Target Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700 border border-rose-200/50 uppercase">
                ALERTA CRÍTICO EM PRODUÇÃO
              </span>
              <span className="rounded border border-blue-200 bg-blue-50/50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 uppercase">
                BORDA EXPOSTA (INTERNET)
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 uppercase">
                TIER 1 - CRÍTICO
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl font-mono">
                {currentVuln.hostTarget.hostname}
              </h1>
              <span className="text-xs font-mono text-slate-400">
                ({currentVuln.hostTarget.internalFqdn})
              </span>
            </div>
          </div>

          {/* Right Exposure Status */}
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/40 p-3 self-start">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping-subtle" />
            <div>
              <div className="font-mono text-[9px] font-bold tracking-wider text-rose-700 uppercase">
                ESTADO DE EXPOSIÇÃO
              </div>
              <div className="font-mono text-xs font-extrabold text-rose-700">
                {hostIsolated ? 'HOST ISOLADO EM QUARENTENA' : 'VULNERÁVEL DIRETO AO GATEWAY'}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metadata Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
              ENDEREÇO IP
            </div>
            <div className="mt-1 flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-slate-900">{currentVuln.hostTarget.ip}</span>
              <span className="rounded bg-blue-50 px-1 py-0.2 text-[9px] font-bold text-blue-700 border border-blue-200">
                NAT/GW
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
              SO / RUNTIME
            </div>
            <div className="mt-1 font-mono text-xs font-bold text-slate-900">
              {currentVuln.hostTarget.osRuntime}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
              POLÍTICA DE HARDENING
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Não Conforme (Falha)</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
              REGIÃO / SUBNET
            </div>
            <div className="mt-1 font-mono text-xs font-bold text-slate-900">
              {currentVuln.hostTarget.region}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Dossier Layout: Left Pane & Right Mitigation Pane */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Technical Exposure Dossier & Raw Inspection */}
        <div className="space-y-6 lg:col-span-2">
          {/* Technical Exposure Dossier Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                DOSSIÊ TÉCNICO DE EXPOSIÇÃO
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                PUBLICADO: {currentVuln.publishedDate}
              </span>
            </div>

            <h2 className="mt-3 text-lg font-extrabold text-slate-900">
              {currentVuln.cveId}: Execução Remota de Código sem Autenticação
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                {currentVuln.cwe}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                {currentVuln.mitreAttack}
              </span>
            </div>

            {/* 3 Metrics Boxes */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-3">
                <div className="font-mono text-[9px] font-bold text-rose-700 uppercase">
                  SEVERIDADE CVSS V3.1
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-extrabold text-rose-600">
                    {(typeof currentVuln.cvss === 'number' ? currentVuln.cvss : Number(currentVuln.cvss) || 0).toFixed(1)}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-rose-700 uppercase">
                    {currentVuln.cvssSeverity}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-rose-500" />
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-3">
                <div className="font-mono text-[9px] font-bold text-slate-500 uppercase">
                  PROBABILIDADE EPSS
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-900">
                    {currentVuln.epssScore}%
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-500">
                  Percentil: <strong className="text-rose-600 font-bold">{currentVuln.epssPercentile}th (Crítico)</strong>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-3">
                <div className="font-mono text-[9px] font-bold text-slate-500 uppercase">
                  CATÁLOGO CISA KEV
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-2xl font-extrabold text-rose-600">
                  <span>SIM</span>
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="mt-1 font-mono text-[10px] text-rose-700 font-bold">
                  Em Exploração Ativa
                </div>
              </div>
            </div>

            {/* Raw CVSS Vector with Copy Button */}
            <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase shrink-0">
                  VETOR BRUTO:
                </span>
                <code className="truncate font-mono text-xs text-slate-700">
                  {currentVuln.cvssVector}
                </code>
              </div>
              <button
                onClick={handleCopyVector}
                className="flex items-center gap-1 rounded bg-white px-2 py-1 font-mono text-[10px] font-bold text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-100 cursor-pointer shrink-0 ml-2"
              >
                {copiedVector ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedVector ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Mecanismo de Exploração & Intercepção */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Mecanismo de Exploração & Intercepção
                </h3>
              </div>
              <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                PACKET-CAPTURE {currentVuln.packetCaptureId}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                A falha reside na ausência de sanitização dos valores fornecidos no cabeçalho <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-bold">SESSID</code> durante a manipulação do relatório de integridade do host (HIP). O serviço interno de telemetria invoca um shell script de coleta sem validar o path traversal.
              </p>
              <p>
                O adversário encadeia a criação de um arquivo temporário no filesystem <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-bold">/opt/panlogs/tmp/device_telemetry/</code> com um comando bash injetado via pipeline, culminando na execução direta de código com privilégios de superusuário (<strong className="text-rose-600 font-bold">root</strong>).
              </p>
            </div>

            {/* Terminal Raw Inspection */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-slate-400 font-semibold">WAF_INGRESS_CAPTURE // RAW_INSPECTION</span>
                </div>
                <span className="text-rose-400 font-bold">MATCH: SIGNATURE_PAN_RCE_01</span>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed">
                <span className="text-slate-500"># HTTP Header Injection Request via Ingress Gateway Node</span>{'\n'}
                <span className="text-emerald-400 font-bold">POST</span> /ssl-vpn/hipreport.esp HTTP/1.1{'\n'}
                Host: <span className="text-blue-400">{currentVuln.hostTarget.ip}</span>{'\n'}
                User-Agent: Mozilla/5.0 (Security-Scanner/Audit){'\n'}
                Content-Type: application/x-www-form-urlencoded{'\n'}
                <span className="text-rose-400 font-bold">Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/mic2.darknet/sh</span>{'\n'}
                Content-Length: 0{'\n\n'}
                <span className="text-slate-700">-------------------------------------------------------------</span>{'\n'}
                <span className="text-slate-500"># TELEMETRY DAEMON LOG ENTRY TRIGGERED:</span>{'\n'}
                <span className="text-amber-400">[CRITICAL_EXEC]</span>{' execve("/bin/sh", ["/bin/sh", "-c", "cat /opt/panlogs/tmp/device_telemetry/..."], ...)\n\n'}
                <span className="text-rose-500 font-bold flex items-center gap-1">
                  ⊗ RESULT: Arbitrary privilege escalation with uid=0(root) gid=0(root)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Plano de Mitigação em Camadas & Resposta Operacional */}
        <div className="space-y-6">
          {/* Layered Mitigation Plan */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Plano de Mitigação em Camadas
                </h3>
              </div>
              <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-700">
                SOAR V4 AUTOMATED
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Layer 1 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-blue-600 uppercase">
                    CAMADA 1 · SOLUÇÃO DEFINITIVA
                  </span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700 border border-emerald-200/50">
                    {currentVuln.mitigationLayer1.badge}
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-900">
                  {currentVuln.mitigationLayer1.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  {currentVuln.mitigationLayer1.description}
                </p>
              </div>

              {/* Layer 2 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-blue-600 uppercase">
                    CAMADA 2 · WORKAROUND IMEDIATO
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    TEMPO ESTIMADO: ~30s
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  {currentVuln.mitigationLayer2.description}
                </p>

                {/* Kubectl Command Snippet */}
                <div className="mt-2.5 rounded-lg border border-slate-800 bg-slate-900 p-2.5 font-mono text-[10px] text-slate-200">
                  <code>{currentVuln.mitigationLayer2.command}</code>
                </div>

                <button
                  onClick={handleCopyCommand}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedCmd ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCmd ? 'Comando Copiado' : 'Copiar Comando Kubectl'}</span>
                </button>
              </div>

              {/* Mandatory SLA Countdown */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-rose-700">
                    <Clock className="h-3.5 w-3.5" />
                    <span>SLA DE CONTENÇÃO MANDATÓRIA</span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-rose-600">
                    {formatTimer(remainingSeconds)}
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: '78%' }} />
                </div>

                <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-slate-500">
                  <span>ALVO: 4 HORAS (CRITICAL EXPOSURE)</span>
                  <span className="font-bold text-rose-600">78% DECORRIDO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Response Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div>
              <div className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                AÇÕES DE RESPOSTA OPERACIONAL
              </div>
              <h3 className="mt-0.5 text-sm font-extrabold text-slate-900">
                Execução em 1-Clique
              </h3>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() =>
                  onExecutePatch(
                    `Hotfix Firmware ${currentVuln.cveId}`,
                    currentVuln.hostTarget.hostname
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-white" />
                <span>Aprovar & Executar Patch Automatizado</span>
              </button>

              <button
                onClick={() => {
                  setHostIsolated(!hostIsolated);
                  onIsolateHost(currentVuln.hostTarget.hostname, currentVuln.hostTarget.ip);
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                  hostIsolated
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
                }`}
              >
                <ShieldX className="h-4 w-4" />
                <span>
                  {hostIsolated
                    ? 'Remover Host da Quarentena'
                    : 'Isolar Host da Rede (Quarentena Total)'}
                </span>
              </button>

              <button
                onClick={onExportDossierPdf}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-slate-500" />
                <span>Exportar Dossiê Forense PDF</span>
              </button>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between font-mono text-[9px] text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>LOG ASSINADO DIGITALMENTE</span>
              </div>
              <span>AUDIT ID: #9842-AX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
