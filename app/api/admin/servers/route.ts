import { NextResponse } from 'next/server';
import { getAllServersWithUsers } from '@/lib/sqlite';

export async function GET() {
  try {
    const servers = getAllServersWithUsers();
    return NextResponse.json(servers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

