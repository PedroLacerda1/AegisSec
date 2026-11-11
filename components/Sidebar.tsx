'use client';

import React from 'react';
import {
  LayoutGrid,
  ShieldAlert,
  Wrench,
  Server,
  Bot,
  FileText,
  Settings,
  Shield,
  Activity,
} from 'lucide-react';

export type NavTabId =
  | 'posture'
  | 'vuln-hub'
  | 'remediation'
  | 'assets-cves'
  | 'automations'
  | 'audit-logs'
  | 'settings';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  defenseHealth?: number;
}

export function Sidebar({ currentTab, onSelectTab, defenseHealth = 84 }: SidebarProps) {
  const coreNavItems = [
    {
      id: 'posture' as NavTabId,
      label: 'Postura de Segurança',
      icon: LayoutGrid,
    },
    {
      id: 'vuln-hub' as NavTabId,
      label: 'Hub de Vulnerabilidades',
      icon: ShieldAlert,
      badge: '184',
    },
    {
      id: 'remediation' as NavTabId,
      label: 'Planos de Remediação',
      icon: Wrench,
      hasDot: true,
    },
    {
      id: 'assets-cves' as NavTabId,
      label: 'Ativos & CVEs',
      icon: Server,
    },
  ];

  const govNavItems = [
    {
      id: 'automations' as NavTabId,
      label: 'Automações',
      icon: Bot,
    },
    {
      id: 'audit-logs' as NavTabId,
      label: 'Logs de Auditoria',
      icon: FileText,
    },
    {
      id: 'settings' as NavTabId,
      label: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white select-none">
      {/* Top Branding */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            {/* Custom Shield Brand Logo */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Shield className="h-5 w-5 fill-white text-blue-600" />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20" />
            </div>
            <div>
              <div className="flex items-center text-sm font-extrabold tracking-tight text-slate-900">
                <span>AEGIS</span>
                <span className="text-blue-600">SEC</span>
              </div>
              <div className="font-mono text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                DEFENSE OPS
              </div>
            </div>
          </div>

          {/* Green Status Dot on Top Right */}
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-6">
          {/* Section: OPERAÇÕES CORE */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
              OPERAÇÕES CORE
            </div>
            <div className="space-y-1">
              {coreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {/* Active Indicator or Dot */}
                    {isActive ? (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shadow-xs" />
                    ) : item.badge ? (
                      <span className="font-mono text-[10px] text-slate-400">
                        {item.badge}
                      </span>
                    ) : item.hasDot ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400/60" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: GOVERNANÇA & SECOPS */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
              GOVERNANÇA & SECOPS
            </div>
            <div className="space-y-1">
              {govNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Status Card: SOC ENGINE */}
      <div className="p-3">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-700 tracking-wide">
              SOC ENGINE v4.2
            </span>
            <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700 border border-emerald-200/60">
              SYNCED
            </span>
          </div>

          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 font-mono">
              <span>DEFENSE GRID</span>
              <span className="text-slate-800">{defenseHealth}% HEALTH</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${defenseHealth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
