'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Header } from '@/components/Header';
import { Sidebar, NavTabId } from '@/components/Sidebar';
import { SecurityPostureView } from '@/components/views/SecurityPostureView';
import { VulnerabilityHubView } from '@/components/views/VulnerabilityHubView';
import { RemediationPlansView } from '@/components/views/RemediationPlansView';
import { AssetsAndCVEView } from '@/components/views/AssetsAndCVEView';
import { AutomationsView } from '@/components/views/AutomationsView';
import { AuditLogsView } from '@/components/views/AuditLogsView';
import { SettingsView } from '@/components/views/SettingsView';
import { ActionModal, ModalType } from '@/components/modals/ActionModal';
import { SearchModal } from '@/components/modals/SearchModal';
import {
  REMEDIATION_CARDS,
  INITIAL_VULNERABILITIES,
  RemediationCard,
  Vulnerability,
} from '@/lib/cyber-data';
import { AuthScreen, AuthUser } from '@/components/auth/AuthScreen';
import { CheckCircle2 } from 'lucide-react';

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const DEFAULT_USER: AuthUser = {
  id: 'usr-1',
  name: 'Dr. Gabriel Vasconcelos',
  email: 'pedrohenrilacerda@gmail.com',
  initials: 'GV',
  role: 'Lead SecOps Cmdr',
  badgeLevel: 'SEC-LEVEL ALPHA',
};

export default function Home() {
  const isMounted = useIsMounted();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(DEFAULT_USER);
  const [currentTab, setCurrentTab] = useState<NavTabId>('posture');
  const [selectedCveId, setSelectedCveId] = useState<string>('CVE-2024-3400');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [defenseHealth, setDefenseHealth] = useState(84);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deterministic initial seed data (identical on server and client)
  const [tasks, setTasks] = useState<RemediationCard[]>(REMEDIATION_CARDS);
  const [vulns, setVulns] = useState<Vulnerability[]>(INITIAL_VULNERABILITIES);

  // Track pending deletion target
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'task' | 'vuln';
    id: string;
    title: string;
  } | null>(null);

  // Hydration-safe client initialization & DB sync
  useEffect(() => {
    queueMicrotask(() => {
      // 1. Sync session and cached state from localStorage after mount
      try {
        const savedUser = localStorage.getItem('aegis_session_user');
        if (savedUser === 'LOGGED_OUT') {
          setCurrentUser(null);
        } else if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }

        const savedTasks = localStorage.getItem('aegis_tasks');
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTasks(
              parsed.map((c: any) => ({
                ...c,
                severityScore: Number(c.severityScore) || 7.5,
                assignees:
                  Array.isArray(c.assignees) && c.assignees.length > 0
                    ? c.assignees
                    : [{ name: c.assigneeName || 'Gabriel M.', avatarText: c.assigneeAvatar || 'GM' }],
                toolFooter: c.toolFooter || {
                  name: c.engineType || 'Ansible #892',
                  actionLabel: 'Ver Logs',
                  actionType: 'logs',
                },
              }))
            );
          }
        }

        const savedVulns = localStorage.getItem('aegis_vulns');
        if (savedVulns) {
          const parsed = JSON.parse(savedVulns);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVulns(
              parsed.map((v: any) => ({
                ...v,
                cvss: typeof v.cvss === 'number' ? v.cvss : parseFloat(String(v.cvss)) || 7.5,
                epssScore: typeof v.epssScore === 'number' ? v.epssScore : parseFloat(String(v.epssScore)) || 85.0,
              }))
            );
          }
        }
      } catch (e) {
        /* ignore */
      }
    });

    // 2. Load live data from PostgreSQL / API
    async function loadDataFromDb() {
      try {
        const [vulnRes, taskRes] = await Promise.all([
          fetch('/api/vulns'),
          fetch('/api/tasks'),
        ]);

        if (vulnRes.ok) {
          const vulnJson = await vulnRes.json();
          if (vulnJson.success && Array.isArray(vulnJson.data) && vulnJson.data.length > 0) {
            const dbVulns: Vulnerability[] = vulnJson.data.map((row: any) => {
              const cvssNum = typeof row.cvss === 'number' ? row.cvss : parseFloat(String(row.cvss)) || 7.5;
              const epssNum = typeof row.epssScore === 'number' ? row.epssScore : parseFloat(String(row.epssScore)) || 85.0;
              const tagsArr = Array.isArray(row.tags)
                ? row.tags
                : typeof row.tags === 'string'
                ? row.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
                : ['KEV', 'RCE'];

              return {
                id: String(row.id || row.cveId),
                cveId: row.cveId,
                title: row.title,
                component: row.component || 'Sistema Operacional',
                cvss: cvssNum,
                cvssSeverity: row.cvssSeverity || (cvssNum >= 9.0 ? 'CRITICAL' : cvssNum >= 7.0 ? 'HIGH' : 'MEDIUM'),
                cvssVector: row.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
                epssScore: epssNum,
                epssPercentile: Number(row.epssPercentile) || 90,
                affectedCount: Number(row.affectedCount) || 1,
                affectedType: row.affectedType || 'Hosts',
                environment: row.environment || 'PROD',
                environmentCount: Number(row.environmentCount) || 1,
                targetDescription: row.targetDescription || 'Servidor de Produção',
                tags: tagsArr,
                hasPatch: Boolean(row.hasPatch),
                isZeroDay: Boolean(row.isZeroDay),
                isCisaKev: Boolean(row.isCisaKev),
                publishedDate: row.publishedDate || '12 Jan 2024',
                cwe: row.cwe || 'CWE-78',
                mitreAttack: row.mitreAttack || 'MITRE ATT&CK T1059',
                exploitMechanism: row.exploitMechanism || 'Vetor de exploração remota via payload não sanitizado em gateway.',
                packetCaptureId: row.packetCaptureId || '#04921',
                rawInspectionLog: row.rawInspectionLog || `[PCAP INSPECT] Incoming packet from ${row.targetIp || '198.51.100.44'}`,
                mitigationLayer1: {
                  title: 'Rollout de Patch Oficial Homologado',
                  description: 'Aplica pacote de atualização no binário com validação de integridade criptográfica.',
                  badge: 'HOTFIX HOMOLOGADO',
                },
                mitigationLayer2: {
                  title: 'Contenção Imediata via WAF / Ingress',
                  description: 'Bloqueio do vetor de path traversal e restrição mTLS no gateway.',
                  command: `kubectl exec -it ${row.targetHostname || 'prod-ingress-01'} -n edge -- nginx -s reload`,
                },
                hostTarget: {
                  hostname: row.targetHostname || 'prod-k8s-ingress-01',
                  internalFqdn: `${row.targetHostname || 'prod-k8s-ingress-01'}.corp.internal`,
                  ip: row.targetIp || '198.51.100.44',
                  isNatGw: true,
                  osRuntime: 'Linux Kernel 6.1 / Nginx Plus',
                  hardeningStatus: 'Falha',
                  region: row.targetRegion || 'AWS sa-east-1 (São Paulo)',
                },
              };
            });
            setVulns(dbVulns);
          }
        }

        if (taskRes.ok) {
          const taskJson = await taskRes.json();
          if (taskJson.success && Array.isArray(taskJson.data) && taskJson.data.length > 0) {
            const dbTasks: RemediationCard[] = taskJson.data.map((row: any) => {
              const name = row.assigneeName || row.assignee_name || 'Gabriel M.';
              const avatarText = row.assigneeAvatar || row.assignee_avatar || 'GM';
              const engineName = row.engineType || row.engine_type || 'Ansible #892';
              const col = row.column || 'executing';
              return {
                id: String(row.id || row.taskCode),
                taskCode: row.taskCode || row.task_code,
                cveOrRef: row.cveOrRef || row.cve_or_ref || 'SEC-OPS',
                severityLabel: row.severityLabel || row.severity_label || 'HIGH',
                severityScore: Number(row.severityScore || row.severity_score) || 7.5,
                badgeType: row.badgeType || row.badge_type || 'HIGH',
                title: row.title,
                summary: row.summary,
                squad: row.squad,
                assignees: [
                  {
                    name,
                    avatarText,
                  },
                ],
                progressText: row.progressText || row.progress_text || 'PROGRESSO CLUSTER: 50%',
                progressPercent: Number(row.progressPercent ?? row.progress_percent) || 0,
                column: col,
                blockReason: row.blockReason || row.block_reason,
                blockedDurationHours: row.blockedDurationHours ?? row.blocked_duration_hours,
                riskCompliance: row.riskCompliance || row.risk_compliance,
                cabVotes: row.cabVotes || row.cab_votes,
                engineType: engineName,
                targetPod: row.targetPod || row.target_pod,
                timeoutMinutes: row.timeoutMinutes ?? row.timeout_minutes,
                toolFooter: {
                  name: engineName,
                  actionLabel:
                    col === 'blocked'
                      ? 'Solicitar Aprovação'
                      : col === 'verifying'
                      ? 'Forçar Re-scan'
                      : 'Ver Logs',
                  actionType: 'logs',
                },
              };
            });
            setTasks(dbTasks);
          }
        }
      } catch (err) {
        console.warn('API DB sync offline or using cached state:', err);
      }
    }

    loadDataFromDb();
  }, []);

  // Sync to localStorage after mounting
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aegis_tasks', JSON.stringify(tasks));
      localStorage.setItem('aegis_vulns', JSON.stringify(vulns));
    } catch (e) {
      /* ignore */
    }
  }, [tasks, vulns, isMounted]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Handlers for cross-view actions
  const handleNavigateToView = (view: string, cveId?: string) => {
    if (cveId) {
      setSelectedCveId(cveId);
    }
    setCurrentTab(view as NavTabId);
  };

  const handleExecutePatch = (taskTitle: string, target: string) => {
    setModalData({ taskTitle, target });
    setModalType('patch-runner');
  };

  const handleIsolateHost = (hostname: string, ip: string) => {
    setModalData({ hostname, ip });
    setModalType('isolate-host');
  };

  const handleOpenLogs = (title: string, content: string) => {
    setModalData({ title, content });
    setModalType('view-logs');
  };

  // --- CRUD Operations for Remediation Tasks ---
  const handleOpenCreateTask = () => {
    setModalData({ isEditing: false });
    setModalType('task-form');
  };

  const handleOpenEditTask = (task: RemediationCard) => {
    setModalData({ isEditing: true, task });
    setModalType('task-form');
  };

  const handleOpenDeleteTask = (task: RemediationCard) => {
    setDeleteTarget({ type: 'task', id: task.id, title: `${task.taskCode}: ${task.title}` });
    setModalData({ itemType: 'Plano de Remediação', title: `${task.taskCode}: ${task.title}`, id: task.id });
    setModalType('delete-confirm');
  };

  const handleSaveTask = (savedTask: RemediationCard) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id || t.taskCode === savedTask.taskCode);
      if (exists) {
        showToast(`Tarefa ${savedTask.taskCode} atualizada com sucesso no banco.`);
        // Background update to DB
        fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedTask),
        }).catch((e) => console.warn('DB async update error:', e));

        return prev.map((t) => (t.id === savedTask.id || t.taskCode === savedTask.taskCode ? savedTask : t));
      } else {
        showToast(`Nova tarefa ${savedTask.taskCode} adicionada ao Sprint e persistida.`);
        // Background insert to DB
        fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedTask),
        }).catch((e) => console.warn('DB async insert error:', e));

        return [savedTask, ...prev];
      }
    });
  };

  const handleMoveTaskColumn = (taskId: string, targetCol: RemediationCard['column']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId || t.taskCode === taskId) {
          const colName =
            targetCol === 'executing'
              ? 'Em Execução'
              : targetCol === 'blocked'
              ? 'Bloqueado'
              : 'Verificação';
          showToast(`Tarefa ${t.taskCode} movida para ${colName}.`);
          // Background sync
          fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskCode: t.taskCode, column: targetCol }),
          }).catch((e) => console.warn('DB column sync error:', e));

          return { ...t, column: targetCol };
        }
        return t;
      })
    );
  };

  // --- CRUD Operations for Vulnerabilities ---
  const handleOpenCreateVuln = () => {
    setModalData({ isEditing: false });
    setModalType('vuln-form');
  };

  const handleOpenEditVuln = (vuln: Vulnerability) => {
    setModalData({ isEditing: true, vuln });
    setModalType('vuln-form');
  };

  const handleOpenDeleteVuln = (vuln: Vulnerability) => {
    setDeleteTarget({ type: 'vuln', id: vuln.id, title: `${vuln.cveId}: ${vuln.title}` });
    setModalData({ itemType: 'Vulnerabilidade', title: `${vuln.cveId}: ${vuln.title}`, id: vuln.id });
    setModalType('delete-confirm');
  };

  const handleSaveVuln = (savedVuln: Vulnerability) => {
    setVulns((prev) => {
      const exists = prev.some((v) => v.id === savedVuln.id || v.cveId === savedVuln.cveId);
      const tagsString = Array.isArray(savedVuln.tags) ? savedVuln.tags.join(', ') : savedVuln.tags;
      if (exists) {
        showToast(`Vulnerabilidade ${savedVuln.cveId} atualizada no banco.`);
        fetch('/api/vulns', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...savedVuln, tags: tagsString }),
        }).catch((e) => console.warn('DB vuln update error:', e));

        return prev.map((v) => (v.id === savedVuln.id || v.cveId === savedVuln.cveId ? savedVuln : v));
      } else {
        showToast(`Vulnerabilidade ${savedVuln.cveId} registrada no Hub e persistida.`);
        fetch('/api/vulns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...savedVuln, tags: tagsString }),
        }).catch((e) => console.warn('DB vuln insert error:', e));

        return [savedVuln, ...prev];
      }
    });
  };

  // --- Handle Universal Deletion Confirmation ---
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'task') {
      const targetItem = tasks.find((t) => t.id === deleteTarget.id);
      const code = targetItem ? targetItem.taskCode : deleteTarget.id;
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id && t.taskCode !== deleteTarget.id));
      fetch(`/api/tasks?taskCode=${encodeURIComponent(code)}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('DB delete task error:', e));
      showToast(`Plano de remediação removido com sucesso.`);
    } else if (deleteTarget.type === 'vuln') {
      const targetVuln = vulns.find((v) => v.id === deleteTarget.id);
      const cve = targetVuln ? targetVuln.cveId : deleteTarget.id;
      setVulns((prev) => prev.filter((v) => v.id !== deleteTarget.id && v.cveId !== deleteTarget.id));
      fetch(`/api/vulns?cveId=${encodeURIComponent(cve)}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('DB delete vuln error:', e));
      showToast(`Vulnerabilidade descartada/arquivada do inventário.`);
    }
    setDeleteTarget(null);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('aegis_session_user', JSON.stringify(user));
    } catch (e) {
      /* ignore */
    }
    showToast(`Bem-vindo, ${user.name}! Sessão mTLS estabelecida.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.setItem('aegis_session_user', 'LOGGED_OUT');
    } catch (e) {
      /* ignore */
    }
    showToast('Sessão de operador encerrada com segurança.');
  };

  if (isMounted && !currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      {/* 1. Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        defenseHealth={defenseHealth}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Sticky Header */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenSearch={() => setIsSearchOpen(true)}
          onFilterClick={() => {
            if (currentTab !== 'vuln-hub') setCurrentTab('vuln-hub');
          }}
          onNavigateToView={handleNavigateToView}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'posture' && (
            <SecurityPostureView
              onNavigateToView={handleNavigateToView}
              onExecutePatch={handleExecutePatch}
              onIsolateHost={handleIsolateHost}
              onExportDossier={() => setModalType('export-dossier')}
            />
          )}

          {currentTab === 'vuln-hub' && (
            <VulnerabilityHubView
              vulns={vulns}
              onSelectCVE={(cveId) => {
                setSelectedCveId(cveId);
                setCurrentTab('assets-cves');
              }}
              onOpenScanModal={() => setModalType('network-scan')}
              onExportCsv={() => {
                showToast('Exportação CSV/PDF do inventário gerada com sucesso.');
              }}
              onBatchExecute={(count) => {
                handleExecutePatch(`Remediação em Lote (${count} CVEs)`, 'Hosts Homologados');
              }}
              onIsolateKevScope={() => {
                handleIsolateHost('Pool KEV CISA BOD 22-01', '198.51.100.0/24');
              }}
              onOpenCreateVulnModal={handleOpenCreateVuln}
              onOpenEditVulnModal={handleOpenEditVuln}
              onOpenDeleteVulnModal={handleOpenDeleteVuln}
            />
          )}

          {currentTab === 'remediation' && (
            <RemediationPlansView
              tasks={tasks}
              onOpenLogsModal={handleOpenLogs}
              onOpenWarRoomModal={() => {
                showToast('War Room de SecOps aberta no canal seguro #bridge-sec-ops.');
              }}
              onEmergencyCABApproval={() => setModalType('cab-approval')}
              onTriggerScan={(target) => {
                showToast(`Re-scan DAST disparado para ${target}. Fila #1 prioritária.`);
              }}
              onNewPlaybookModal={() => setModalType('new-playbook')}
              onOpenCreateTaskModal={handleOpenCreateTask}
              onOpenEditTaskModal={handleOpenEditTask}
              onOpenDeleteTaskModal={handleOpenDeleteTask}
              onMoveTaskColumn={handleMoveTaskColumn}
            />
          )}

          {currentTab === 'assets-cves' && (
            <AssetsAndCVEView
              selectedCveId={selectedCveId}
              onExecutePatch={handleExecutePatch}
              onIsolateHost={handleIsolateHost}
              onExportDossierPdf={() => setModalType('export-dossier')}
              onNavigateToView={(view) => setCurrentTab(view as NavTabId)}
            />
          )}

          {currentTab === 'automations' && (
            <AutomationsView
              onOpenLogsModal={handleOpenLogs}
              onNewPlaybook={() => setModalType('new-playbook')}
            />
          )}

          {currentTab === 'audit-logs' && <AuditLogsView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* 3. Action Modals (with CRUD support) */}
      <ActionModal
        type={modalType}
        data={modalData}
        onClose={() => setModalType(null)}
        onSuccess={() => {
          setDefenseHealth((prev) => Math.min(100, prev + 3));
          showToast('Ação de ciberdefesa homologada com sucesso.');
        }}
        onSaveTask={handleSaveTask}
        onSaveVuln={handleSaveVuln}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* 4. Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleNavigateToView}
      />

      {/* 5. Live Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
