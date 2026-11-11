import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20261110000000_initial_schema.sql');
    const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');

    let migrationSql = '';
    let seedSql = '';

    if (fs.existsSync(migrationPath)) {
      migrationSql = fs.readFileSync(migrationPath, 'utf8');
    }
    if (fs.existsSync(seedPath)) {
      seedSql = fs.readFileSync(seedPath, 'utf8');
    }

    return NextResponse.json({
      success: true,
      migrationSql,
      seedSql,
      filename: '20261110000000_initial_schema.sql',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error reading migration' },
      { status: 500 }
    );
  }
}
