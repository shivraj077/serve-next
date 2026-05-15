import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Update all users that don't have a role field yet
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );
    
    return NextResponse.json({ 
      message: 'Database initialized successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
