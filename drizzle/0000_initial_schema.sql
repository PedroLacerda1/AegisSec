CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" text NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"result" text DEFAULT 'SUCCESS' NOT NULL,
	"hash" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playbooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"target_env" text NOT NULL,
	"trigger" text NOT NULL,
	"status_text" text NOT NULL,
	"status_type" text DEFAULT 'running' NOT NULL,
	"progress" integer DEFAULT 100 NOT NULL,
	"success_rate" text DEFAULT '98.2' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "playbooks_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remediation_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_code" text NOT NULL,
	"cve_or_ref" text NOT NULL,
	"severity_label" text NOT NULL,
	"severity_score" text NOT NULL,
	"badge_type" text DEFAULT 'MEDIUM' NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"squad" text NOT NULL,
	"assignee_name" text DEFAULT 'Gabriel M.' NOT NULL,
	"assignee_avatar" text DEFAULT 'GM' NOT NULL,
	"progress_text" text DEFAULT 'PROGRESSO: 0%' NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"column" text DEFAULT 'executing' NOT NULL,
	"block_reason" text,
	"blocked_duration_hours" integer,
	"risk_compliance" text,
	"cab_votes" text,
	"engine_type" text,
	"target_pod" text,
	"timeout_minutes" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "remediation_tasks_task_code_unique" UNIQUE("task_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT 'Dr. Gabriel Vasconcelos' NOT NULL,
	"role" text DEFAULT 'Lead SecOps Cmdr' NOT NULL,
	"initials" text DEFAULT 'GV' NOT NULL,
	"badge_level" text DEFAULT 'SEC-LEVEL ALPHA' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vulnerabilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"cve_id" text NOT NULL,
	"title" text NOT NULL,
	"component" text NOT NULL,
	"cvss" text NOT NULL,
	"cvss_severity" text NOT NULL,
	"cvss_vector" text NOT NULL,
	"epss_score" text NOT NULL,
	"epss_percentile" integer DEFAULT 90 NOT NULL,
	"affected_count" integer DEFAULT 1 NOT NULL,
	"affected_type" text DEFAULT 'Hosts' NOT NULL,
	"environment" text DEFAULT 'PROD' NOT NULL,
	"environment_count" integer DEFAULT 1 NOT NULL,
	"target_description" text NOT NULL,
	"tags" text DEFAULT 'KEV, RCE' NOT NULL,
	"has_patch" boolean DEFAULT true NOT NULL,
	"is_zero_day" boolean DEFAULT false NOT NULL,
	"is_cisa_kev" boolean DEFAULT false NOT NULL,
	"published_date" text NOT NULL,
	"cwe" text DEFAULT 'CWE-78' NOT NULL,
	"mitre_attack" text DEFAULT 'MITRE ATT&CK T1059' NOT NULL,
	"exploit_mechanism" text,
	"packet_capture_id" text,
	"raw_inspection_log" text,
	"target_hostname" text DEFAULT 'fw-edge-sp01.corp' NOT NULL,
	"target_ip" text DEFAULT '198.51.100.44' NOT NULL,
	"target_region" text DEFAULT 'AWS sa-east-1 (São Paulo)' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vulnerabilities_cve_id_unique" UNIQUE("cve_id")
);
