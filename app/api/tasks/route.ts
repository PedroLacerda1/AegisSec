import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { remediationTasks } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db.select().from(remediationTasks);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('Error fetching tasks from DB:', error);
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
      .insert(remediationTasks)
      .values({
        taskCode: body.taskCode || `SEC-${Math.floor(4000 + Math.random() * 900)}`,
        cveOrRef: body.cveOrRef || 'SEC-HOTFIX',
        severityLabel: body.severityLabel || 'HIGH',
        severityScore: String(body.severityScore || '7.5'),
        badgeType: body.badgeType || 'HIGH',
        title: body.title,
        summary: body.summary,
        squad: body.squad || 'Cloud Sec & DevOps',
        assigneeName: body.assigneeName || 'Gabriel M.',
        assigneeAvatar: body.assigneeAvatar || 'GM',
        progressText: body.progressText || 'PROGRESSO: 0%',
        progressPercent: body.progressPercent ? Number(body.progressPercent) : 0,
        column: body.column || 'executing',
        blockReason: body.blockReason || null,
        blockedDurationHours: body.blockedDurationHours ? Number(body.blockedDurationHours) : null,
        riskCompliance: body.riskCompliance || null,
        cabVotes: body.cabVotes || null,
        engineType: body.engineType || null,
        targetPod: body.targetPod || null,
        timeoutMinutes: body.timeoutMinutes ? Number(body.timeoutMinutes) : null,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error('Error inserting task into DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database insert error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.taskCode) {
      return NextResponse.json({ success: false, error: 'taskCode required' }, { status: 400 });
    }

    const updated = await db
      .update(remediationTasks)
      .set({
        title: body.title,
        summary: body.summary,
        squad: body.squad,
        assigneeName: body.assigneeName,
        assigneeAvatar: body.assigneeAvatar,
        progressText: body.progressText,
        progressPercent: body.progressPercent !== undefined ? Number(body.progressPercent) : undefined,
        column: body.column,
        blockReason: body.blockReason,
        blockedDurationHours: body.blockedDurationHours !== undefined ? Number(body.blockedDurationHours) : undefined,
        riskCompliance: body.riskCompliance,
        cabVotes: body.cabVotes,
      })
      .where(eq(remediationTasks.taskCode, body.taskCode))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('Error updating task in DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database update error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskCode = searchParams.get('taskCode');
    if (!taskCode) {
      return NextResponse.json({ success: false, error: 'taskCode is required' }, { status: 400 });
    }

    await db.delete(remediationTasks).where(eq(remediationTasks.taskCode, taskCode));
    return NextResponse.json({ success: true, message: `Task ${taskCode} deleted` });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database delete error' },
      { status: 500 }
    );
  }
}
