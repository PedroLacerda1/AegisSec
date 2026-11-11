'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Download,
  Copy,
  Check,
  Radar,
  FileText,
  Lock,
  Trash2,
  Edit,
  Plus,
} from 'lucide-react';
import { RemediationCard, Vulnerability, PlaybookItem } from '@/lib/cyber-data';

export type ModalType =
  | 'patch-runner'
  | 'isolate-host'
  | 'cab-approval'
  | 'network-scan'
  | 'export-dossier'
  | 'view-logs'
  | 'new-playbook'
  | 'new-plan'
  | 'task-form'
  | 'vuln-form'
  | 'delete-confirm'
  | null;

interface ActionModalProps {
  type: ModalType;
  data?: any;
  onClose: () => void;
  onSuccess?: () => void;
  onSaveTask?: (task: RemediationCard) => void;
  onSaveVuln?: (vuln: Vulnerability) => void;
  onConfirmDelete?: () => void;
}

export function ActionModal({
  type,
  data,
  onClose,
  onSuccess,
  onSaveTask,
  onSaveVuln,
  onConfirmDelete,
}: ActionModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {type === 'patch-runner' && (
          <PatchRunnerModal data={data} onClose={onClose} onSuccess={onSuccess} />
        )}

        {type === 'isolate-host' && (
          <IsolateHostModal data={data} onClose={onClose} onSuccess={onSuccess} />
        )}

        {type === 'cab-approval' && (
          <CABApprovalModal onClose={onClose} onSuccess={onSuccess} />
        )}

        {type === 'network-scan' && (
          <NetworkScanModal onClose={onClose} onSuccess={onSuccess} />
        )}

        {type === 'export-dossier' && (
          <ExportDossierModal data={data} onClose={onClose} />
        )}

        {type === 'view-logs' && (
          <ViewLogsModal data={data} onClose={onClose} />
        )}

        {type === 'new-playbook' && (
          <NewPlaybookModal onClose={onClose} onSuccess={onSuccess} />
        )}

        {type === 'task-form' && (
          <TaskFormModal
            data={data}
            onClose={onClose}
            onSave={(task) => {
              if (onSaveTask) onSaveTask(task);
              onClose();
            }}
          />
        )}

        {type === 'vuln-form' && (
          <VulnFormModal
            data={data}
            onClose={onClose}
            onSave={(vuln) => {
              if (onSaveVuln) onSaveVuln(vuln);
              onClose();
            }}
          />
        )}

        {type === 'delete-confirm' && (
          <DeleteConfirmModal
            data={data}
            onClose={onClose}
            onConfirm={() => {
              if (onConfirmDelete) onConfirmDelete();
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}

// 1. Task Form Modal (Create & Update Remediation Task)
function TaskFormModal({
  data,
  onClose,
  onSave,
}: {
  data?: { task?: RemediationCard; isEditing?: boolean };
  onClose: () => void;
  onSave: (task: RemediationCard) => void;
}) {
  const isEditing = !!data?.isEditing;
  const initial = data?.task;

  const [taskCode, setTaskCode] = useState(initial?.taskCode || 'SEC-4125');
  const [cveOrRef, setCveOrRef] = useState(initial?.cveOrRef || 'CVE-2024-');
  const [title, setTitle] = useState(initial?.title || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [severityScore, setSeverityScore] = useState(initial?.severityScore || 8.0);
  const [squad, setSquad] = useState<RemediationCard['squad']>(initial?.squad || 'Cloud Sec & DevOps');
  const [assigneeName, setAssigneeName] = useState(
    initial?.assignees?.[0]?.name || (initial as any)?.assigneeName || 'Gabriel M.'
  );
  const [column, setColumn] = useState<RemediationCard['column']>(initial?.column || 'executing');
  const [progressPercent, setProgressPercent] = useState(initial?.progressPercent || 25);
  const [blockReason, setBlockReason] = useState(initial?.blockReason || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let badgeType: RemediationCard['badgeType'] = 'MEDIUM';
    if (severityScore >= 9.0) badgeType = 'CRITICAL';
    else if (severityScore >= 7.0) badgeType = 'HIGH';

    const avatarText = assigneeName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const updatedTask: RemediationCard = {
      id: initial?.id || `rem-${Date.now()}`,
      taskCode,
      cveOrRef,
      severityLabel: `${badgeType} · ${severityScore.toFixed(1)}`,
      severityScore,
      badgeType,
      title,
      summary,
      squad,
      assignees: [{ name: assigneeName, avatarText }],
      progressText:
        column === 'blocked'
          ? 'CAB APROVAÇÃO: Pendente'
          : `PROGRESSO CLUSTER: ${progressPercent}%`,
      progressPercent,
      toolFooter: initial?.toolFooter || {
        name: 'Ansible Runner',
        actionLabel: 'Ver Logs',
        actionType: 'logs',
      },
      column,
      blockReason: column === 'blocked' ? blockReason || 'Aguardando validação técnica' : undefined,
      blockedDurationHours: column === 'blocked' ? 4 : undefined,
      riskCompliance: column === 'blocked' ? 'PCI-DSS 4.0 Fail' : undefined,
      cabVotes: column === 'blocked' ? 'Pendente (3/5 votos)' : undefined,
    };

    onSave(updatedTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            {isEditing ? `Editar Tarefa ${taskCode}` : 'Cadastrar Novo Plano de Remediação'}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {isEditing ? 'Atualize os parâmetros e atribuições' : 'Adicione uma tarefa à esteira do Sprint #42'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Código da Tarefa:</label>
          <input
            type="text"
            required
            value={taskCode}
            onChange={(e) => setTaskCode(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Referência CVE / Política:</label>
          <input
            type="text"
            required
            value={cveOrRef}
            onChange={(e) => setCveOrRef(e.target.value)}
            placeholder="Ex: CVE-2024-3400 ou POLICY-TLS"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="font-semibold text-slate-700">Título da Remediação:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Rollout de Patch Kernel Linux 6.1.72"
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
        />
      </div>

      <div className="text-xs">
        <label className="font-semibold text-slate-700">Resumo Técnico / Escopo:</label>
        <textarea
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Descreva o vetor de risco, o impacto e a ação esperada..."
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Squad Responsável:</label>
          <select
            value={squad}
            onChange={(e) => setSquad(e.target.value as any)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
          >
            <option value="Cloud Sec & DevOps">Cloud Sec & DevOps</option>
            <option value="Identity Sec">Identity Sec</option>
            <option value="Infra Core">Infra Core</option>
            <option value="Pagamentos & Checkout">Pagamentos & Checkout</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700">Coluna no Kanban:</label>
          <select
            value={column}
            onChange={(e) => setColumn(e.target.value as any)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
          >
            <option value="executing">Em Execução</option>
            <option value="blocked">Bloqueado / Aguardando Aprovação</option>
            <option value="verifying">Verificação & Re-scan DAST/SAST</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700">Severidade CVSS:</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={severityScore}
            onChange={(e) => setSeverityScore(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Engenheiro / Assignee:</label>
          <input
            type="text"
            value={assigneeName}
            onChange={(e) => setAssigneeName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Progresso do Rollout (%):</label>
          <div className="mt-1 flex items-center gap-2 font-mono">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => setProgressPercent(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
            <span className="w-10 text-right font-bold text-slate-800">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {column === 'blocked' && (
        <div className="text-xs">
          <label className="font-semibold text-rose-700">Motivo do Bloqueio:</label>
          <input
            type="text"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Ex: Aguardando regressão da equipe de Pagamentos..."
            className="mt-1 w-full rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-2 text-slate-900"
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
        >
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Tarefa'}
        </button>
      </div>
    </form>
  );
}

// 2. Vuln Form Modal (Create & Update Vulnerability)
function VulnFormModal({
  data,
  onClose,
  onSave,
}: {
  data?: { vuln?: Vulnerability; isEditing?: boolean };
  onClose: () => void;
  onSave: (vuln: Vulnerability) => void;
}) {
  const isEditing = !!data?.isEditing;
  const initial = data?.vuln;

  const [cveId, setCveId] = useState(initial?.cveId || 'CVE-2024-');
  const [title, setTitle] = useState(initial?.title || '');
  const [component, setComponent] = useState(initial?.component || '');
  const [cvss, setCvss] = useState(initial?.cvss || 9.0);
  const [epssScore, setEpssScore] = useState(initial?.epssScore || 85.0);
  const [affectedCount, setAffectedCount] = useState(initial?.affectedCount || 8);
  const [affectedType, setAffectedType] = useState(initial?.affectedType || 'Hosts');
  const [environment, setEnvironment] = useState<Vulnerability['environment']>(initial?.environment || 'PROD');
  const [targetDescription, setTargetDescription] = useState(initial?.targetDescription || 'Edge Gateways');
  const [tagsStr, setTagsStr] = useState(initial?.tags.join(', ') || 'KEV, RCE');
  const [isCisaKev, setIsCisaKev] = useState(initial?.isCisaKev ?? true);
  const [isZeroDay, setIsZeroDay] = useState(initial?.isZeroDay ?? false);
  const [hasPatch, setHasPatch] = useState(initial?.hasPatch ?? true);
  const [hostname, setHostname] = useState(initial?.hostTarget?.hostname || 'prod-k8s-ingress-02');
  const [ip, setIp] = useState(initial?.hostTarget?.ip || '10.240.12.90');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cveId.trim() || !title.trim()) return;

    let cvssSeverity: Vulnerability['cvssSeverity'] = 'MEDIUM';
    if (cvss >= 9.0) cvssSeverity = 'CRITICAL';
    else if (cvss >= 7.0) cvssSeverity = 'HIGH';
    else if (cvss < 4.0) cvssSeverity = 'LOW';

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedVuln: Vulnerability = {
      id: initial?.id || `vuln-${Date.now()}`,
      cveId,
      title,
      component,
      cvss,
      cvssSeverity,
      cvssVector: initial?.cvssVector || `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`,
      epssScore,
      epssPercentile: Math.min(99, Math.round(epssScore)),
      affectedCount,
      affectedType,
      environment,
      environmentCount: affectedCount,
      targetDescription,
      tags,
      hasPatch,
      isZeroDay,
      isCisaKev,
      publishedDate: initial?.publishedDate || new Date().toLocaleDateString('pt-BR'),
      cwe: initial?.cwe || 'CWE-78: OS Command Injection',
      mitreAttack: initial?.mitreAttack || 'MITRE ATT&CK T1059',
      exploitMechanism: initial?.exploitMechanism || 'Vulnerabilidade identificada via scan automatizado de vulnerabilidade.',
      packetCaptureId: initial?.packetCaptureId || '#05112',
      rawInspectionLog: initial?.rawInspectionLog || `# Telemetry Probe:\nTarget: ${ip}\nStatus: Verified RCE vector`,
      mitigationLayer1: initial?.mitigationLayer1 || {
        title: `Patch Oficial ${cveId}`,
        description: 'Substituição de binário vulnerável homologada.',
        badge: 'PATCH DISPONÍVEL',
      },
      mitigationLayer2: initial?.mitigationLayer2 || {
        title: 'Bloqueio WAF Perimetral',
        description: 'Isolamento de rota HTTP não autenticada.',
        command: `kubectl patch ingress -n edge --type=json -p='[{"op":"add","path":"/spec/rules"}]'`,
      },
      hostTarget: {
        hostname,
        internalFqdn: `${hostname}.corp.internal`,
        ip,
        isNatGw: true,
        osRuntime: 'Alpine 3.19 / Nginx Plus',
        hardeningStatus: 'Falha',
        region: 'AWS sa-east-1 (São Paulo)',
      },
    };

    onSave(updatedVuln);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            {isEditing ? `Editar ${cveId}` : 'Cadastrar Nova Vulnerabilidade / Achado'}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {isEditing ? 'Atualize score, mitigação ou ativos afetados' : 'Registro de vulnerabilidade interna ou zero-day'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700">CVE ID:</label>
          <input
            type="text"
            required
            value={cveId}
            onChange={(e) => setCveId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">CVSS (0.0 - 10.0):</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={cvss}
            onChange={(e) => setCvss(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">EPSS Score (%):</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={epssScore}
            onChange={(e) => setEpssScore(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="font-semibold text-slate-700">Título da Vulnerabilidade:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Ivanti Connect Secure Command Injection"
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
        />
      </div>

      <div className="text-xs">
        <label className="font-semibold text-slate-700">Componente / Pacote Afetado:</label>
        <input
          type="text"
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          placeholder="Ex: web-admin-api / RestHandler.py"
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Qtd. Afetada:</label>
          <input
            type="number"
            value={affectedCount}
            onChange={(e) => setAffectedCount(parseInt(e.target.value) || 1)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Tipo de Ativo:</label>
          <input
            type="text"
            value={affectedType}
            onChange={(e) => setAffectedType(e.target.value)}
            placeholder="Hosts, Firewalls, Brokers"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Ambiente:</label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as any)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
          >
            <option value="PROD">PROD</option>
            <option value="STAGING">STAGING</option>
            <option value="CORP">CORP</option>
            <option value="MISTO">MISTO</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Hostname Alvo Primário:</label>
          <input
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>
        <div>
          <label className="font-semibold text-slate-700">Endereço IP:</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="font-semibold text-slate-700">Tags (separadas por vírgula):</label>
        <input
          type="text"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="KEV, RCE, Zero-Day, Supply Chain"
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isCisaKev}
            onChange={(e) => setIsCisaKev(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span className="font-bold text-slate-800">Catálogo CISA KEV</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isZeroDay}
            onChange={(e) => setIsZeroDay(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span className="font-bold text-slate-800">Alerta Zero-Day Ativo</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasPatch}
            onChange={(e) => setHasPatch(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="font-bold text-slate-800">Patch Homologado</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
        >
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Vulnerabilidade'}
        </button>
      </div>
    </form>
  );
}

// 3. Delete Confirmation Modal
function DeleteConfirmModal({
  data,
  onClose,
  onConfirm,
}: {
  data?: { title?: string; itemType?: string; id?: string };
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Confirmar Exclusão / Descarte
          </h3>
          <p className="text-xs text-rose-600 font-mono font-bold">
            Ação Irreversível de Governança
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-slate-700 space-y-2">
        <p>
          Tem certeza de que deseja excluir o seguinte item do sistema?
        </p>
        <div className="rounded-lg bg-white p-3 font-mono border border-rose-200 text-xs">
          <div>TIPO: <strong>{data?.itemType || 'Registro'}</strong></div>
          <div>IDENTIFICAÇÃO: <strong>{data?.title || data?.id}</strong></div>
        </div>
        <p className="text-[11px] text-slate-500">
          Esta remoção será registrada na trilha imutável dos Logs de Auditoria com a sua assinatura digital.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
        >
          Excluir Definitivamente
        </button>
      </div>
    </div>
  );
}

// 4. Patch Runner Simulation
function PatchRunnerModal({ data, onClose, onSuccess }: { data: any; onClose: () => void; onSuccess?: () => void }) {
  const [progress, setProgress] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    'Conectando ao agente de gerenciamento Ansible / Kubelet...',
    'Validando assinatura criptográfica SHA-256 do pacote oficial NIST...',
    'Executando snapshot do filesystem & backup de configuração...',
    'Aplicando hotfix em rolling deployment nos nós afetados...',
    'Reiniciando daemons e validando integridade HIP / Nginx...',
    'Patch homologado com sucesso! Nenhuma regressão detectada.',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          if (onSuccess) onSuccess();
          return 100;
        }
        const next = prev + 18;
        if (next > 30 && currentStep === 0) setCurrentStep(1);
        if (next > 50 && currentStep <= 1) setCurrentStep(2);
        if (next > 70 && currentStep <= 2) setCurrentStep(3);
        if (next > 90 && currentStep <= 3) setCurrentStep(4);
        if (next >= 100) setCurrentStep(5);
        return next > 100 ? 100 : next;
      });
    }, 650);

    return () => clearInterval(timer);
  }, [currentStep, onSuccess]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Zap className="h-5 w-5 fill-current" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Executando Remediação Automatizada
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {data?.taskTitle || 'Rollout de Patch'} · {data?.target || 'Pool K8s'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between font-mono text-xs text-slate-600">
          <span>Progresso do Rollout:</span>
          <span className="font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live Terminal */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 shadow-inner max-h-56 overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-[10px] text-slate-500">
          <Terminal className="h-3.5 w-3.5" />
          <span>AEGIS-RUNNER // STREAM-LOG #892</span>
        </div>
        <div className="mt-3 space-y-1.5">
          {steps.slice(0, currentStep + 1).map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {idx === currentStep && !isCompleted ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <span className={idx === currentStep ? 'text-blue-300 font-bold' : 'text-slate-400'}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          {isCompleted ? 'Fechar' : 'Minimizar para Segundo Plano'}
        </button>
        {isCompleted && (
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
          >
            Concluído com Sucesso
          </button>
        )}
      </div>
    </div>
  );
}

// 5. Isolate Host Modal
function IsolateHostModal({ data, onClose, onSuccess }: { data: any; onClose: () => void; onSuccess?: () => void }) {
  const [isolated, setIsolated] = useState(false);

  const handleConfirm = () => {
    setIsolated(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Confirmar Isolamento de Tráfego de Host
          </h3>
          <p className="text-xs text-rose-600 font-mono font-bold">
            Ação de Quarentena Perimetral Imediata
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-slate-700 space-y-2">
        <p>
          Esta ação aplicará uma regra de <strong>DROP</strong> compulsória no Security Group e no WAF para o host:
        </p>
        <div className="rounded-lg bg-white p-3 font-mono border border-rose-200 text-xs">
          <div>ALVO: <strong>{data?.hostname || 'fw-edge-sp01.corp'}</strong></div>
          <div>IP: <strong>{data?.ip || '198.51.100.44'}</strong></div>
          <div>ESCOPO: Bloqueio de todo tráfego Inbound/Outbound WAN</div>
        </div>
        <p className="text-[11px] text-slate-500">
          Sessões VPN ativas através desta borda serão redirecionadas para o gateway secundário <code className="font-mono text-slate-800">fw-edge-sp02.corp</code> sem perda de estado.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
        >
          {isolated ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
          <span>{isolated ? 'Isolando Host...' : 'Confirmar Quarentena Total'}</span>
        </button>
      </div>
    </div>
  );
}

// 6. CAB Emergency Approval Modal
function CABApprovalModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const [signed, setSigned] = useState(false);

  const handleApprove = () => {
    setSigned(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Aprovação Emergencial de CAB (Change Advisory Board)
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            SEC-3998 · Desativação de TLS 1.0/1.1 no API Gateway Legacy
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-2">
        <p>
          Como <strong>Lead SecOps Cmdr</strong>, você está emitindo uma assinatura de override emergencial para desbloquear a migração de cifras para conformidade <strong>PCI-DSS v4.0</strong>.
        </p>
        <div className="rounded-lg bg-white p-3 font-mono text-[11px] border border-slate-200 space-y-1">
          <div>Votos Atuais: 3 Favoráveis, 0 Contrários, 2 Pendentes (Checkout Squad)</div>
          <div>Justificativa: Exposição crítica a ataques BEAST / POODLE em ambiente de pagamentos</div>
          <div>Aprovador: Dr. Gabriel Vasconcelos (ID: GV-99401)</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleApprove}
          className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
        >
          {signed ? 'Assinando & Desbloqueando...' : 'Emitir Override Emergencial'}
        </button>
      </div>
    </div>
  );
}

// 7. Network Scan Modal
function NetworkScanModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const [subnet, setSubnet] = useState('10.240.0.0/16');
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanDone(true);
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Radar className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Disparar Novo Scan de Vulnerabilidades na Rede
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Sonda ativa via Shodan Monitor & Cortex Xpanse Recon
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Sub-rede ou Cluster Alvo:</label>
          <select
            value={subnet}
            onChange={(e) => setSubnet(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900"
          >
            <option value="10.240.0.0/16">10.240.0.0/16 - VPC Primária AWS sa-east-1</option>
            <option value="198.51.100.0/24">198.51.100.0/24 - Borda WAN & Firewalls</option>
            <option value="k8s-cluster-sp01">k8s-cluster-sp01 - 20 Nós Kubernetes de Produção</option>
          </select>
        </div>

        {scanning && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 font-mono text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>Sondando portas e comparando assinaturas NIST...</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-600">
              Verificando 4.280 nós e correlacionando CVEs com o catálogo CISA KEV...
            </div>
          </div>
        )}

        {scanDone && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-mono text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Scan finalizado com sucesso!</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600">
              Todos os hosts reavaliados. Hub de vulnerabilidades atualizado com telemetria recente.
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Fechar
        </button>
        {!scanDone && (
          <button
            onClick={startScan}
            disabled={scanning}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {scanning ? 'Executando Scan...' : 'Iniciar Scan Agora'}
          </button>
        )}
      </div>
    </div>
  );
}

// 8. Export Dossier Modal
function ExportDossierModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const reportText = `=====================================================
AEGISSEC DEFENSE OPS - DOSSIÊ TÉCNICO DE EXPOSIÇÃO
=====================================================
Data de Emissão: ${new Date().toLocaleString('pt-BR')}
Classificação: CONFIDENCIAL / SECOPS LEVEL ALPHA
Auditor: Dr. Gabriel Vasconcelos (Lead SecOps Cmdr)
Cluster: SAO-PAULO-01

INCIDENTE: #SEC-9842
CVE: CVE-2024-3400 (Palo Alto GlobalProtect OS)
CVSS Score: 10.0 CRITICAL MAX (Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
EPSS Probabilidade: 99.1% (99th Percentile)
CISA KEV: Sim (Ativamente Explorado)

ALVO AFETADO:
Hostname: fw-edge-sp01.corp (prod-k8s-ingress-01)
Endereço IP: 198.51.100.44 / 10.240.12.88
Região: AWS sa-east-1 (São Paulo)

MECANISMO DE EXPLORAÇÃO:
Injeção de comando arbitrária via path traversal no cabeçalho SESSID
do endpoint de telemetria HIP (/ssl-vpn/hipreport.esp).
Execução em privilégios root comprovada em volátil.

STATUS DE MITIGAÇÃO:
- Camada 1: Patch de Firmware v11.1.2-h3 homologado
- Camada 2: Workaround imediato via desativação de telemetria Nginx
- Hash de Integridade: SHA256-4fa9881c2098d4ab

Documento assinado digitalmente pelo SOC Engine v4.2.
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisSec-Dossie-Forense-CVE-2024-3400.txt`;
    a.click();
    setDownloaded(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Exportar Dossiê Forense de Segurança
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Relatório de conformidade pronto para auditoria CISO & NIST
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] text-slate-700 space-y-1.5 max-h-48 overflow-y-auto">
        <div className="font-bold text-slate-900">DOSSIÊ: CVE-2024-3400 & Postura Geral</div>
        <div>Classificação: SEC-LEVEL ALPHA</div>
        <div>Assinatura Hash: SHA256: 4fa9...881c (Assinado digitalmente)</div>
        <div>Inclui: Captura de pacotes raw, evidência de memória volátil, SLA de contenção e plano em camadas.</div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Fechar
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>{downloaded ? 'Dossiê Baixado' : 'Baixar Arquivo Forense'}</span>
        </button>
      </div>
    </div>
  );
}

// 9. View Logs Modal
function ViewLogsModal({ data, onClose }: { data: any; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            {data?.title || 'Logs de Execução'}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Registro detalhado do executor de infraestrutura
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto">
        {data?.content || 'Nenhum log registrado.'}
      </div>

      <div className="flex items-center justify-end pt-2">
        <button
          onClick={onClose}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

// 10. New Playbook Modal
function NewPlaybookModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [target, setTarget] = useState('');

  const handleCreate = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Cadastrar Novo Playbook SOAR
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Autômatos de resposta com disparo contínuo
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Nome do Playbook:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Auto-Quarentena de Containers Maliciosos"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-mono"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Gatilho (Trigger):</label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="Ex: Falco Alert Syscall execve root"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-mono"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Ambiente Alvo:</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Ex: AWS EKS Cluster SP-01"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-mono"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
        >
          Criar Playbook
        </button>
      </div>
    </div>
  );
}
