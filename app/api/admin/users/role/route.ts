import { NextResponse } from 'next/server';
import { updateUserRole } from '@/lib/sqlite';

export async function PUT(req: Request) {
  try {
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json({ message: 'User ID and New Role are required' }, { status: 400 });
    }

    if (!['user', 'admin'].includes(newRole)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const user = updateUserRole(userId, newRole);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Role updated successfully', user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

