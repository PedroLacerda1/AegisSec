'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  History,
  Share2,
  Plus,
  Play,
  Pause,
  RotateCw,
  AlertTriangle,
  CheckCircle,
  FileText,
  Shield,
  Layers,
  ExternalLink,
  ChevronRight,
  Flame,
  Radio,
  Sliders,
  MoreVertical,
  Cpu,
  Lock,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  REMEDIATION_CARDS,
  PLAYBOOKS_DATA,
  RemediationCard,
  PlaybookItem,
} from '@/lib/cyber-data';

interface RemediationPlansViewProps {
  tasks?: RemediationCard[];
  onOpenLogsModal: (title: string, logContent: string) => void;
  onOpenWarRoomModal: () => void;
  onEmergencyCABApproval: () => void;
  onTriggerScan: (target: string) => void;
  onNewPlaybookModal: () => void;
  onOpenCreateTaskModal: () => void;
  onOpenEditTaskModal: (task: RemediationCard) => void;
  onOpenDeleteTaskModal: (task: RemediationCard) => void;
  onMoveTaskColumn?: (taskId: string, targetCol: RemediationCard['column']) => void;
}

export function RemediationPlansView({
  tasks = REMEDIATION_CARDS,
  onOpenLogsModal,
  onOpenWarRoomModal,
  onEmergencyCABApproval,
  onTriggerScan,
  onNewPlaybookModal,
  onOpenCreateTaskModal,
  onOpenEditTaskModal,
  onOpenDeleteTaskModal,
  onMoveTaskColumn,
}: RemediationPlansViewProps) {
  const [activeTab, setActiveTab] = useState<'sprints' | 'playbooks' | 'history'>('sprints');
  const [selectedSquad, setSelectedSquad] = useState<'ALL' | 'CLOUD' | 'IDENTITY' | 'INFRA'>('ALL');
  const [playbooks, setPlaybooks] = useState<PlaybookItem[]>(PLAYBOOKS_DATA);
  const [rescanTriggered, setRescanTriggered] = useState(false);
  const [cabApproved, setCabApproved] = useState(false);

  // Filter cards by squad
  const cards = tasks.filter((card) => {
    if (selectedSquad === 'CLOUD') return card.squad === 'Cloud Sec & DevOps';
    if (selectedSquad === 'IDENTITY') return card.squad === 'Identity Sec';
    if (selectedSquad === 'INFRA') return card.squad === 'Infra Core' || card.squad === 'Pagamentos & Checkout';
    return true;
  });

  const executingCards = cards.filter((c) => c.column === 'executing');
  const blockedCards = cards.filter((c) => c.column === 'blocked');
  const verifyingCards = cards.filter((c) => c.column === 'verifying');

  const togglePlaybook = (id: string) => {
    setPlaybooks((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.statusType === 'running' ? 'standby' : 'running';
          return {
            ...p,
            statusType: nextStatus,
            statusText: nextStatus === 'running' ? 'Em Execução Ativa' : 'Pausado pelo Operador',
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-blue-600 uppercase">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              ACTIVE SPRINT SEC-OPS #42
            </span>
            <span className="text-slate-300 font-mono">·</span>
            <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase">
              CICLO QUINZENAL
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700 border border-rose-200/50">
              <Clock className="h-3 w-3" />
              SLA: 3 DIAS RESTANTES
            </span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Redução de Superfície de Ataque
            </h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
              META CISO: 0 CRÍTICAS
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-3xl">
            Remediação prioritária de vetores RCE e consolidação de cifras TLS obsoletas em clusters Kubernetes de produção.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>Histórico de Sprints</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
            <Share2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Importar Jira / ServiceNow</span>
          </button>

          <button
            onClick={onOpenCreateTaskModal}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Plano de Remediação</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              PROGRESSO GERAL
            </span>
            <div className="relative flex h-7 w-7 items-center justify-center">
              <svg className="h-7 w-7 -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-blue-600" strokeDasharray="68, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">68%</span>
            <span className="text-xs font-semibold text-slate-500 font-mono">{cards.length} tarefas</span>
          </div>

          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: '68%' }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              MITIGAÇÕES VALIDADAS SOC
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-200/50">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">08</span>
            <span className="text-xs font-semibold text-slate-500">Aprovadas no SIEM</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-emerald-600">
            <span>+3 nas últimas 24h</span>
            <svg className="h-3 w-10 text-emerald-500" viewBox="0 0 40 15" fill="none">
              <path d="M 0 12 L 15 10 L 25 6 L 40 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              FALHAS EM RE-TESTE
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-rose-50 text-rose-600 border border-rose-200/50">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">02</span>
            <span className="text-xs font-semibold text-slate-500">Requer intervenção</span>
            <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-700">ATTENTION</span>
          </div>

          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-rose-500" style={{ width: '40%' }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              PATCHES AUTOMATIZADOS
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-200/50">
              <Cpu className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">12</span>
            <span className="text-xs font-semibold text-slate-500">Via Ansible & Terraform</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-600">
            <span>TAXA SUCESSO:</span>
            <strong className="text-blue-700 font-bold">96.4%</strong>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation / Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('sprints')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sprints'
                ? 'bg-blue-50 text-blue-700 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Sprints Ativos</span>
            <span className="rounded-full bg-blue-200/70 px-1.5 py-0.2 text-[10px] font-mono text-blue-800">
              {cards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('playbooks')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'playbooks'
                ? 'bg-blue-50 text-blue-700 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Automações & Playbooks</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-50 text-blue-700 font-extrabold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Histórico & Auditoria</span>
          </button>
        </div>

        {/* Right Squad Filters */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">SQUADS:</span>
          {(['ALL', 'CLOUD', 'IDENTITY', 'INFRA'] as const).map((sq) => {
            const labels = {
              ALL: 'TODAS (4)',
              CLOUD: 'CLOUD SEC',
              IDENTITY: 'IDENTITY',
              INFRA: 'INFRA CORE',
            };
            return (
              <button
                key={sq}
                onClick={() => setSelectedSquad(sq)}
                className={`rounded-md px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  selectedSquad === sq
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {labels[sq]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Kanban Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Column 1: Em Execução */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Em Execução
              </h3>
              <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-600">
                {executingCards.length}
              </span>
            </div>
            <button
              onClick={onOpenCreateTaskModal}
              title="Adicionar tarefa em Execução"
              className="text-slate-400 hover:text-blue-600 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {executingCards.map((card) => (
              <div
                key={card.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all"
              >
                {/* Header & Quick Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                        card.badgeType === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                          : card.badgeType === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {card.severityLabel}
                    </span>
                    <span className="font-mono text-[10px] text-blue-600 font-semibold">
                      {card.cveOrRef}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-400 mr-1">
                      {card.taskCode}
                    </span>
                    {/* Edit button */}
                    <button
                      onClick={() => onOpenEditTaskModal(card)}
                      title="Editar Tarefa"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => onOpenDeleteTaskModal(card)}
                      title="Excluir Tarefa"
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <h4 className="mt-2 text-xs font-bold text-slate-900">
                  {card.title}
                </h4>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                  {card.summary}
                </p>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2 text-[10px]">
                  <span className="text-slate-600 font-medium">{card.squad}</span>
                  <div className="flex items-center gap-1.5">
                    {(card.assignees && card.assignees.length > 0
                      ? card.assignees
                      : [{ name: 'Gabriel M.', avatarText: 'GM' }]
                    ).map((a) => (
                      <div
                        key={a.name}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[8px] font-bold text-white"
                        title={a.name}
                      >
                        {a.avatarText}
                      </div>
                    ))}
                    <span className="text-slate-700 font-semibold">
                      {card.assignees?.[0]?.name || 'Gabriel M.'}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>{card.progressText}</span>
                    <span className="font-bold text-slate-800">{card.progressPercent}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${card.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Move Column controls */}
                {onMoveTaskColumn && (
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-100 pt-2 text-slate-400">
                    <span>Mover para:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onMoveTaskColumn(card.id, 'blocked')}
                        className="rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Bloqueado
                      </button>
                      <button
                        onClick={() => onMoveTaskColumn(card.id, 'verifying')}
                        className="rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Verificação
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">
                    {card.toolFooter?.name || 'Ansible #892'}
                  </span>
                  <button
                    onClick={() =>
                      onOpenLogsModal(
                        card.title,
                        `[RUNNER EXEC: ${card.toolFooter?.name || 'Ansible Runner'}]\nTask ID: ${card.taskCode}\nTarget: ${card.squad}\nProgress: ${card.progressPercent}%\nStatus: ACTIVE ROLLOUT\n\n- [OK] Initialized pre-check signature\n- [OK] Verified checksum against NIST repository\n- [RUNNING] Applying configuration to target cluster nodes\n- [LOG] Step 15/20 verified with 0 error code`
                      )
                    }
                    className="flex items-center gap-1 font-mono text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    <span>{card.toolFooter?.actionLabel || 'Ver Logs'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Bloqueado / Aguardando Aprovação */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Bloqueado / Aguardando Aprovação
              </h3>
              <span className="rounded bg-rose-50 px-1.5 py-0.2 font-mono text-[10px] font-bold text-rose-700">
                {blockedCards.length}
              </span>
            </div>
            <button
              onClick={onOpenCreateTaskModal}
              title="Adicionar tarefa em Bloqueado"
              className="text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {blockedCards.map((card) => (
              <div
                key={card.id}
                className="group relative rounded-xl border border-rose-200/80 bg-white p-4 shadow-2xs hover:border-rose-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-700 border border-rose-200/50">
                      POLICY-9 · CRÍTICA
                    </span>
                    <span className="rounded border border-rose-200 bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-600">
                      GATEWAY BLOCK
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-400 mr-1">
                      {card.taskCode}
                    </span>
                    <button
                      onClick={() => onOpenEditTaskModal(card)}
                      title="Editar Tarefa"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onOpenDeleteTaskModal(card)}
                      title="Excluir Tarefa"
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <h4 className="mt-2 text-xs font-bold text-slate-900">
                  {card.title}
                </h4>

                {/* Warning / Reason Box */}
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-900">
                    <Lock className="h-3 w-3 text-amber-700" />
                    <span>MOTIVO DO BLOQUEIO (HÁ {card.blockedDurationHours || 18} HORAS):</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-900">
                    {card.blockReason || 'Aguardando validação dos testes de homologação do squad responsável.'}
                  </p>
                </div>

                <div className="mt-3 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SQUAD IMPACTADA:</span>
                    <span className="font-bold text-slate-800">{card.squad}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">RISCO COMPLIANCE:</span>
                    <span className="font-bold text-rose-600">{card.riskCompliance || 'Atenção Necessária'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">CAB APROVAÇÃO:</span>
                    <span className="font-bold text-amber-600">
                      {cabApproved ? 'Aprovado (5/5 votos)' : card.cabVotes || 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Move Column controls */}
                {onMoveTaskColumn && (
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono border-t border-slate-100 pt-2 text-slate-400">
                    <span>Mover para:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onMoveTaskColumn(card.id, 'executing')}
                        className="rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Em Execução
                      </button>
                      <button
                        onClick={() => onMoveTaskColumn(card.id, 'verifying')}
                        className="rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Verificação
                      </button>
                    </div>
                  </div>
                )}

                {/* Emergency Actions */}
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    disabled={cabApproved}
                    onClick={() => {
                      setCabApproved(true);
                      onEmergencyCABApproval();
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                      cabApproved
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{cabApproved ? 'Aprovação Emergencial Emitida' : 'Solicitar Aprovação Emergencial'}</span>
                  </button>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">SLA CAB ESTOURA EM: 6H</span>
                    <button
                      onClick={onOpenWarRoomModal}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Abrir War Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Verificação & Re-scan DAST/SAST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Verificação & Re-scan DAST/SAST
              </h3>
              <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-600">
                {verifyingCards.length}
              </span>
            </div>
            <button
              onClick={onOpenCreateTaskModal}
              title="Adicionar tarefa em Verificação"
              className="text-slate-400 hover:text-cyan-600 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {verifyingCards.map((card) => (
              <div
                key={card.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                        card.badgeType === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {card.severityLabel}
                    </span>
                    <span className="font-mono text-[10px] text-blue-600 font-semibold">
                      {card.cveOrRef}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-400 mr-1">
                      {card.taskCode}
                    </span>
                    <button
                      onClick={() => onOpenEditTaskModal(card)}
                      title="Editar Tarefa"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onOpenDeleteTaskModal(card)}
                      title="Excluir Tarefa"
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <h4 className="mt-2 text-xs font-bold text-slate-900">
                  {card.title}
                </h4>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {card.summary}
                </p>

                {/* Move Column controls */}
                {onMoveTaskColumn && (
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-100 pt-2 text-slate-400">
                    <span>Mover para:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onMoveTaskColumn(card.id, 'executing')}
                        className="rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Em Execução
                      </button>
                      <button
                        onClick={() => onMoveTaskColumn(card.id, 'blocked')}
                        className="rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Bloqueado
                      </button>
                    </div>
                  </div>
                )}

                {/* Engine Specifics */}
                {card.engineType ? (
                  <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/40 p-2.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-blue-800">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>{card.engineType}</span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-slate-600">
                      TARGET POD: <code className="bg-white px-1 rounded border border-slate-200">{card.targetPod}</code>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">
                        TIMEOUT: {card.timeoutMinutes} MIN
                      </span>
                      <button
                        onClick={() => {
                          setRescanTriggered(true);
                          onTriggerScan(card.targetPod || 'auth-svc');
                        }}
                        className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 font-mono text-[10px] font-bold text-white shadow-2xs hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Play className="h-3 w-3 fill-white" />
                        <span>{rescanTriggered ? 'Scan Iniciado' : 'Forçar Re-scan Imediato'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-500">STATUS SCAN:</span>
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <RotateCw className="h-2.5 w-2.5 animate-spin" />
                        Pen-test em Andamento
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-blue-600 animate-pulse" style={{ width: '65%' }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">ESTIMATIVA: 12 MIN</span>
                      <button
                        onClick={() =>
                          onOpenLogsModal(
                            'Pen-Test GraphQL CORS Live Stream',
                            `[DAST HARNESS: LIVE PACKET INJECTION]\nEndpoint: https://api.corp.bank/graphql/v2\nTest suite: CORS Wildcard Origin Reflection Test\nRequest:\nOPTIONS /graphql/v2 HTTP/1.1\nOrigin: https://evil-attacker.example\nAccess-Control-Request-Method: POST\n\nResponse:\nHTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://corp.bank (SANITY VERIFIED - WILDCARD BLOCKED)\n\n[PASS] Vulnerability mitigated.`
                          )
                        }
                        className="flex items-center gap-1 font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        <Radio className="h-3 w-3 text-blue-500 animate-pulse" />
                        <span>Live Stream</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Playbooks Ativos de Remediação Automatizada */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200/50">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Playbooks Ativos de Remediação Automatizada
                </h3>
                <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-700">
                  EXECUÇÃO SOC
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Autômatos de contenção, orquestração e sanitização com monitoramento de telemetria contínua.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
              <Sliders className="h-3.5 w-3.5 text-slate-500" />
              <span>Configurar Triggers</span>
            </button>
            <button
              onClick={onNewPlaybookModal}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Novo Playbook</span>
            </button>
          </div>
        </div>

        {/* Playbooks Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5">PLAYBOOK & ID</th>
                <th className="px-4 py-2.5">ALVO / AMBIENTE</th>
                <th className="px-4 py-2.5">TRIGGER DISPARADOR</th>
                <th className="px-4 py-2.5">STATUS EM EXECUÇÃO</th>
                <th className="px-4 py-2.5">TAXA DE SUCESSO</th>
                <th className="px-4 py-2.5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {playbooks.map((pb) => (
                <tr key={pb.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-mono font-bold text-slate-900">{pb.code}</div>
                        <div className="text-[11px] text-slate-500">{pb.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-slate-700">
                    {pb.targetEnv}
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                    {pb.trigger}
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-bold ${
                        pb.statusType === 'running'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : pb.statusType === 'monitoring'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          pb.statusType === 'running'
                            ? 'bg-blue-600 animate-pulse'
                            : pb.statusType === 'monitoring'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      {pb.statusText}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="w-24">
                      <div className="flex justify-between font-mono text-[10px] text-slate-600">
                        <span>{pb.successRate}%</span>
                      </div>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${pb.successRate}%` }} />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => togglePlaybook(pb.id)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                        title={pb.statusType === 'running' ? 'Pausar Playbook' : 'Executar Playbook'}
                      >
                        {pb.statusType === 'running' ? (
                          <Pause className="h-3.5 w-3.5" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          onOpenLogsModal(
                            `${pb.code} - Configuração & Histórico`,
                            `# PLAYBOOK SPECIFICATION: ${pb.code}\nName: ${pb.name}\nTarget: ${pb.targetEnv}\nTrigger: ${pb.trigger}\nExecution Rate: ${pb.successRate}%\nEngine: SOAR Ansible/Terraform Dispatcher\nLast run: 4 minutes ago with 0 errors`
                          )
                        }
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
