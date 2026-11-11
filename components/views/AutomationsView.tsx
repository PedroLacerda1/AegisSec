'use client';

import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Plus,
  Sliders,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { PLAYBOOKS_DATA, PlaybookItem } from '@/lib/cyber-data';

interface AutomationsViewProps {
  onOpenLogsModal: (title: string, logContent: string) => void;
  onNewPlaybook: () => void;
}

export function AutomationsView({ onOpenLogsModal, onNewPlaybook }: AutomationsViewProps) {
  const [playbooks, setPlaybooks] = useState<PlaybookItem[]>(PLAYBOOKS_DATA);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-2xs">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                GOVERNANÇA & ORQUESTRAÇÃO
              </span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700 border border-emerald-200/50">
                SOAR ACTIVE
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Automações & Playbooks de Defesa
            </h1>
          </div>
        </div>

        <button
          onClick={onNewPlaybook}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Criar Novo Playbook</span>
        </button>
      </div>

      {/* Grid of Automation Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">PLAYBOOKS ATIVOS</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">14 Autômatos</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">99.2% de execução sem falhas</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">TEMPO MÉDIO DE CONTENÇÃO (MTTR)</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-600 font-mono">1m 18s</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Redução de 92% vs. manual</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">AÇÕES EXECUTADAS HOJE</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">342 Disparos</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">28 quarantines, 314 sanitizations</div>
        </div>
      </div>

      {/* Playbook Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {playbooks.map((pb) => (
          <div key={pb.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600">{pb.code}</span>
              <span
                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                  pb.statusType === 'running'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {pb.statusText}
              </span>
            </div>

            <h3 className="mt-2 text-base font-bold text-slate-900">{pb.name}</h3>

            <div className="mt-3 space-y-1.5 font-mono text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ambiente Alvo:</span>
                <span className="font-semibold text-slate-800">{pb.targetEnv}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Trigger:</span>
                <span className="font-semibold text-slate-800">{pb.trigger}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Taxa de Sucesso:</span>
                <span className="font-bold text-emerald-600">{pb.successRate}%</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() =>
                  onOpenLogsModal(
                    `${pb.code} - Auditoria de Execução`,
                    `[AUDIT TRAIL: ${pb.code}]\nTrigger: ${pb.trigger}\nTarget: ${pb.targetEnv}\nStatus: ACTIVE DISPATCH\n- 08:00 UTC Scheduled scan ok\n- 12:45 UTC Signature correlation ok\n- 14:10 UTC Auto-enforcement triggered`
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Histórico
              </button>
              <button
                onClick={() =>
                  onOpenLogsModal(
                    `Executar ${pb.code} Imediatamente`,
                    `Starting manual trigger for playbook ${pb.code}...\nDispatching payload to target ${pb.targetEnv}...\nExecution success: 0 exit code.`
                  )
                }
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                Disparar Agora
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
