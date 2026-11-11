import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { vulnerabilities } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db.select().from(vulnerabilities);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('Error fetching vulnerabilities from DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inserted = await db
      .insert(vulnerabilities)
      .values({
        cveId: body.cveId,
        title: body.title,
        component: body.component || 'Sistema Operacional',
        cvss: String(body.cvss || '7.5'),
        cvssSeverity: body.cvssSeverity || 'HIGH',
        cvssVector: body.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        epssScore: body.epssScore || '85.0%',
        epssPercentile: body.epssPercentile ? Number(body.epssPercentile) : 85,
        affectedCount: body.affectedCount ? Number(body.affectedCount) : 1,
        affectedType: body.affectedType || 'Hosts',
        environment: body.environment || 'PROD',
        environmentCount: body.environmentCount ? Number(body.environmentCount) : 1,
        targetDescription: body.targetDescription || 'Instância de Produção',
        tags: body.tags || 'KEV, RCE',
        hasPatch: body.hasPatch !== undefined ? Boolean(body.hasPatch) : true,
        isZeroDay: Boolean(body.isZeroDay),
        isCisaKev: Boolean(body.isCisaKev),
        publishedDate: body.publishedDate || 'Hoje',
        cwe: body.cwe || 'CWE-78',
        mitreAttack: body.mitreAttack || 'MITRE ATT&CK T1059',
        exploitMechanism: body.exploitMechanism || null,
        packetCaptureId: body.packetCaptureId || null,
        rawInspectionLog: body.rawInspectionLog || null,
        targetHostname: body.targetHostname || 'fw-edge-sp01.corp',
        targetIp: body.targetIp || '198.51.100.44',
        targetRegion: body.targetRegion || 'AWS sa-east-1 (São Paulo)',
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error('Error inserting vulnerability into DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database insert error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.cveId) {
      return NextResponse.json({ success: false, error: 'cveId required' }, { status: 400 });
    }

    const updated = await db
      .update(vulnerabilities)
      .set({
        title: body.title,
        component: body.component,
        cvss: String(body.cvss),
        cvssSeverity: body.cvssSeverity,
        epssScore: body.epssScore,
        affectedCount: body.affectedCount ? Number(body.affectedCount) : undefined,
        environment: body.environment,
        targetDescription: body.targetDescription,
        tags: body.tags,
        hasPatch: body.hasPatch,
        isZeroDay: body.isZeroDay,
        isCisaKev: body.isCisaKev,
      })
      .where(eq(vulnerabilities.cveId, body.cveId))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('Error updating vulnerability:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database update error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cveId = searchParams.get('cveId');
    if (!cveId) {
      return NextResponse.json({ success: false, error: 'cveId is required' }, { status: 400 });
    }

    await db.delete(vulnerabilities).where(eq(vulnerabilities.cveId, cveId));
    return NextResponse.json({ success: true, message: `CVE ${cveId} deleted` });
  } catch (error: any) {
    console.error('Error deleting vulnerability:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database delete error' },
      { status: 500 }
    );
  }
}
