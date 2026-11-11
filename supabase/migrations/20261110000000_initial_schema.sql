-- ==============================================================================
-- AEGIS SEC DEFENSE OPS - SUPABASE INITIAL SCHEMA MIGRATION
-- Migration: 20261110000000_initial_schema.sql
-- Description: Creates core cybersecurity operational tables, indexes, and RLS
-- Compatible with: Supabase CLI, Supabase Cloud SQL Editor, Cloud SQL PostgreSQL
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS / OPERATORS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Dr. Gabriel Vasconcelos',
    role TEXT NOT NULL DEFAULT 'Lead SecOps Cmdr',
    initials TEXT NOT NULL DEFAULT 'GV',
    badge_level TEXT NOT NULL DEFAULT 'SEC-LEVEL ALPHA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for UID lookup
CREATE INDEX IF NOT EXISTS idx_users_uid ON public.users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 3. VULNERABILITIES CATALOG (CVEs, Zero-Days, KEV)
CREATE TABLE IF NOT EXISTS public.vulnerabilities (
    id SERIAL PRIMARY KEY,
    cve_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    component TEXT NOT NULL,
    cvss TEXT NOT NULL,
    cvss_severity TEXT NOT NULL,
    cvss_vector TEXT NOT NULL,
    epss_score TEXT NOT NULL,
    epss_percentile INTEGER NOT NULL DEFAULT 90,
    affected_count INTEGER NOT NULL DEFAULT 1,
    affected_type TEXT NOT NULL DEFAULT 'Hosts',
    environment TEXT NOT NULL DEFAULT 'PROD',
    environment_count INTEGER NOT NULL DEFAULT 1,
    target_description TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT 'KEV, RCE',
    has_patch BOOLEAN NOT NULL DEFAULT true,
    is_zero_day BOOLEAN NOT NULL DEFAULT false,
    is_cisa_kev BOOLEAN NOT NULL DEFAULT false,
    published_date TEXT NOT NULL,
    cwe TEXT NOT NULL DEFAULT 'CWE-78',
    mitre_attack TEXT NOT NULL DEFAULT 'MITRE ATT&CK T1059',
    exploit_mechanism TEXT,
    packet_capture_id TEXT,
    raw_inspection_log TEXT,
    target_hostname TEXT NOT NULL DEFAULT 'fw-edge-sp01.corp',
    target_ip TEXT NOT NULL DEFAULT '198.51.100.44',
    target_region TEXT NOT NULL DEFAULT 'AWS sa-east-1 (São Paulo)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast filtering in SOC views
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_cve_id ON public.vulnerabilities(cve_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON public.vulnerabilities(cvss_severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_env ON public.vulnerabilities(environment);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_cisa_kev ON public.vulnerabilities(is_cisa_kev);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_zero_day ON public.vulnerabilities(is_zero_day);

-- 4. REMEDIATION TASKS (SecOps Sprint Board)
CREATE TABLE IF NOT EXISTS public.remediation_tasks (
    id SERIAL PRIMARY KEY,
    task_code TEXT NOT NULL UNIQUE,
    cve_or_ref TEXT NOT NULL,
    severity_label TEXT NOT NULL,
    severity_score TEXT NOT NULL,
    badge_type TEXT NOT NULL DEFAULT 'MEDIUM',
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    squad TEXT NOT NULL,
    assignee_name TEXT NOT NULL DEFAULT 'Gabriel M.',
    assignee_avatar TEXT NOT NULL DEFAULT 'GM',
    progress_text TEXT NOT NULL DEFAULT 'PROGRESSO: 0%',
    progress_percent INTEGER NOT NULL DEFAULT 0,
    "column" TEXT NOT NULL DEFAULT 'executing',
    block_reason TEXT,
    blocked_duration_hours INTEGER,
    risk_compliance TEXT,
    cab_votes TEXT,
    engine_type TEXT,
    target_pod TEXT,
    timeout_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Kanban columns and squads
CREATE INDEX IF NOT EXISTS idx_tasks_task_code ON public.remediation_tasks(task_code);
CREATE INDEX IF NOT EXISTS idx_tasks_column ON public.remediation_tasks("column");
CREATE INDEX IF NOT EXISTS idx_tasks_squad ON public.remediation_tasks(squad);

-- 5. SOAR PLAYBOOKS TABLE
CREATE TABLE IF NOT EXISTS public.playbooks (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    target_env TEXT NOT NULL,
    trigger TEXT NOT NULL,
    status_text TEXT NOT NULL,
    status_type TEXT NOT NULL DEFAULT 'running',
    progress INTEGER NOT NULL DEFAULT 100,
    success_rate TEXT NOT NULL DEFAULT '98.2%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playbooks_code ON public.playbooks(code);

-- 6. SECURITY AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    timestamp TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    result TEXT NOT NULL DEFAULT 'SUCCESS',
    hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remediation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated operators & public read/write for SOC dashboard operations
CREATE POLICY "Allow public read access to vulnerabilities"
    ON public.vulnerabilities FOR SELECT USING (true);

CREATE POLICY "Allow full access to authenticated operators on vulnerabilities"
    ON public.vulnerabilities FOR ALL USING (true);

CREATE POLICY "Allow public read access to remediation_tasks"
    ON public.remediation_tasks FOR SELECT USING (true);

CREATE POLICY "Allow full access to authenticated operators on remediation_tasks"
    ON public.remediation_tasks FOR ALL USING (true);

CREATE POLICY "Allow public read access to playbooks"
    ON public.playbooks FOR SELECT USING (true);

CREATE POLICY "Allow full access to authenticated operators on playbooks"
    ON public.playbooks FOR ALL USING (true);

CREATE POLICY "Allow public read access to audit_logs"
    ON public.audit_logs FOR SELECT USING (true);

CREATE POLICY "Allow full access to authenticated operators on audit_logs"
    ON public.audit_logs FOR ALL USING (true);

CREATE POLICY "Allow users to read operator profiles"
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow users to manage operator profiles"
    ON public.users FOR ALL USING (true);
