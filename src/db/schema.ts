import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users / Operators table (synced with Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull().default('Dr. Gabriel Vasconcelos'),
  role: text('role').notNull().default('Lead SecOps Cmdr'),
  initials: text('initials').notNull().default('GV'),
  badgeLevel: text('badge_level').notNull().default('SEC-LEVEL ALPHA'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Vulnerabilities catalog
export const vulnerabilities = pgTable('vulnerabilities', {
  id: serial('id').primaryKey(),
  cveId: text('cve_id').notNull().unique(),
  title: text('title').notNull(),
  component: text('component').notNull(),
  cvss: text('cvss').notNull(),
  cvssSeverity: text('cvss_severity').notNull(), // CRITICAL, HIGH, MEDIUM, LOW
  cvssVector: text('cvss_vector').notNull(),
  epssScore: text('epss_score').notNull(),
  epssPercentile: integer('epss_percentile').notNull().default(90),
  affectedCount: integer('affected_count').notNull().default(1),
  affectedType: text('affected_type').notNull().default('Hosts'),
  environment: text('environment').notNull().default('PROD'), // PROD, STAGING, CORP, MISTO
  environmentCount: integer('environment_count').notNull().default(1),
  targetDescription: text('target_description').notNull(),
  tags: text('tags').notNull().default('KEV, RCE'),
  hasPatch: boolean('has_patch').notNull().default(true),
  isZeroDay: boolean('is_zero_day').notNull().default(false),
  isCisaKev: boolean('is_cisa_kev').notNull().default(false),
  publishedDate: text('published_date').notNull(),
  cwe: text('cwe').notNull().default('CWE-78'),
  mitreAttack: text('mitre_attack').notNull().default('MITRE ATT&CK T1059'),
  exploitMechanism: text('exploit_mechanism'),
  packetCaptureId: text('packet_capture_id'),
  rawInspectionLog: text('raw_inspection_log'),
  targetHostname: text('target_hostname').notNull().default('fw-edge-sp01.corp'),
  targetIp: text('target_ip').notNull().default('198.51.100.44'),
  targetRegion: text('target_region').notNull().default('AWS sa-east-1 (São Paulo)'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Remediation Sprint tasks
export const remediationTasks = pgTable('remediation_tasks', {
  id: serial('id').primaryKey(),
  taskCode: text('task_code').notNull().unique(), // SEC-4109
  cveOrRef: text('cve_or_ref').notNull(),
  severityLabel: text('severity_label').notNull(),
  severityScore: text('severity_score').notNull(),
  badgeType: text('badge_type').notNull().default('MEDIUM'), // CRITICAL, HIGH, MEDIUM, POLICY
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  squad: text('squad').notNull(), // Cloud Sec & DevOps, Identity Sec, Infra Core, Pagamentos & Checkout
  assigneeName: text('assignee_name').notNull().default('Gabriel M.'),
  assigneeAvatar: text('assignee_avatar').notNull().default('GM'),
  progressText: text('progress_text').notNull().default('PROGRESSO: 0%'),
  progressPercent: integer('progress_percent').notNull().default(0),
  column: text('column').notNull().default('executing'), // executing, blocked, verifying
  blockReason: text('block_reason'),
  blockedDurationHours: integer('blocked_duration_hours'),
  riskCompliance: text('risk_compliance'),
  cabVotes: text('cab_votes'),
  engineType: text('engine_type'),
  targetPod: text('target_pod'),
  timeoutMinutes: integer('timeout_minutes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// SOAR Playbooks
export const playbooks = pgTable('playbooks', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // PB-KERNEL-AUTO-01
  name: text('name').notNull(),
  targetEnv: text('target_env').notNull(),
  trigger: text('trigger').notNull(),
  statusText: text('status_text').notNull(),
  statusType: text('status_type').notNull().default('running'), // running, standby, monitoring
  progress: integer('progress').notNull().default(100),
  successRate: text('success_rate').notNull().default('98.2'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Security Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  target: text('target').notNull(),
  result: text('result').notNull().default('SUCCESS'), // SUCCESS, WARNING, FAILED
  hash: text('hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
