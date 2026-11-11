import { NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { vulnerabilities, remediationTasks, playbooks, auditLogs, users } from '@/src/db/schema';
import { sql } from 'drizzle-orm';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    const vulnCount = await db.select({ count: sql<number>`count(*)` }).from(vulnerabilities);
    const taskCount = await db.select({ count: sql<number>`count(*)` }).from(remediationTasks);
    const playbookCount = await db.select({ count: sql<number>`count(*)` }).from(playbooks);
    const auditCount = await db.select({ count: sql<number>`count(*)` }).from(auditLogs);
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);

    return NextResponse.json({
      success: true,
      database: {
        engine: 'PostgreSQL 15 (Cloud SQL & Supabase Compatible)',
        host: process.env.SQL_HOST ? 'Connected (Cloud SQL)' : 'Local / Custom',
        dbName: process.env.SQL_DB_NAME || 'postgres',
        supabaseConfigured: isSupabaseConfigured,
        counts: {
          vulnerabilities: Number(vulnCount[0]?.count || 0),
          remediationTasks: Number(taskCount[0]?.count || 0),
          playbooks: Number(playbookCount[0]?.count || 0),
          auditLogs: Number(auditCount[0]?.count || 0),
          users: Number(userCount[0]?.count || 0),
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Database error',
      database: {
        engine: 'PostgreSQL',
        connected: false,
        supabaseConfigured: isSupabaseConfigured,
      },
    });
  }
}
