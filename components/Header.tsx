'use client';

import React, { useState } from 'react';
import { AuthUser } from '@/components/auth/AuthScreen';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Shield,
  Radio,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';

interface HeaderProps {
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenSearch: () => void;
  onFilterClick: () => void;
  onNavigateToView: (view: string, cveId?: string) => void;
}

export function Header({
  currentUser,
  onLogout,
  onOpenSearch,
  onFilterClick,
  onNavigateToView,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Alerta Zero-Day Ativo: CVE-2024-3400',
      time: 'Há 4 minutos',
      type: 'critical',
      desc: 'Tentativa de exploração WAN detectada no gateway perimetral fw-edge-sp01.corp.',
      cveId: 'CVE-2024-3400',
    },
    {
      id: 'notif-2',
      title: 'Rollout de Patch Ansible Concluído',
      time: 'Há 28 minutos',
      type: 'info',
      desc: 'Patch do Kernel Linux 6.1.72 aplicado em 15 de 20 nós do cluster.',
    },
    {
      id: 'notif-3',
      title: 'Feed CISA KEV Sincronizado',
      time: 'Há 1 hora',
      type: 'success',
      desc: '6 novas assinaturas de exploit ativo ingeridas e correlacionadas.',
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      {/* Left indicators */}
      <div className="flex items-center gap-3">
        {/* Telemetry Node Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-mono tracking-tight text-[11px] text-slate-800">
            TELEMETRY NODE · SP-01 · LIVE
          </span>
        </div>

        {/* Security Level Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-700">
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-mono text-[11px] tracking-wide text-blue-900">
            SEC-LEVEL ALPHA
          </span>
        </div>
      </div>

      {/* Middle & Right utilities */}
      <div className="flex items-center gap-3">
        {/* Global Search Input Bar */}
        <div
          onClick={onOpenSearch}
          className="group flex h-9 w-72 md:w-80 cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-500 transition-all hover:border-slate-300 hover:bg-white hover:shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            <span className="truncate">Buscar ativos, CVEs, IPs ou has...</span>
          </div>
          <kbd className="inline-flex h-5 items-center justify-center rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] text-slate-500 shadow-2xs">
            /
          </kbd>
        </div>

        {/* Filters Button */}
        <button
          onClick={onFilterClick}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
          <span>FILTROS</span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              1
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-88 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Notificações Operacionais
                  </span>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    1 Crítica
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="group cursor-pointer py-2.5 transition-colors hover:bg-slate-50/80 rounded-lg p-2"
                    onClick={() => {
                      setShowNotifications(false);
                      if (n.cveId) {
                        onNavigateToView('assets-cves', n.cveId);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'critical' ? (
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                        ) : n.type === 'success' ? (
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          {n.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                      {n.desc}
                    </p>
                    {n.cveId && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline">
                        Abrir dossiê forense <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Commander */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-1.5 pr-2.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white tracking-wider">
              {currentUser?.initials || 'GV'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Dr. Gabriel Vasconcelos'}
              </div>
              <div className="text-[10px] font-medium text-slate-500 leading-tight">
                {currentUser?.role || 'Lead SecOps Cmdr'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs">
              <div className="px-2.5 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{currentUser?.name || 'Dr. Gabriel Vasconcelos'}</div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser?.email || 'operador@aegis.bank'}</div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    mTLS Ativo
                  </span>
                  <span className="font-mono text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {currentUser?.badgeLevel || 'SEC-LEVEL ALPHA'}
                  </span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToView('audit-logs');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Meus Logs de Auditoria
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToView('settings');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Credenciais & Chaves API
                </button>
              </div>

              {onLogout && (
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Encerrar Sessão (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
