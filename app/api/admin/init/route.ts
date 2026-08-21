import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlite';

export async function GET() {
  try {
    getDb();
    
    return NextResponse.json({ 
      message: 'SQLite Database initialized successfully', 
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

