import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all servers and populate user details
    const servers = await Server.find({})
      .populate('userId', 'email firstName lastName')
      .sort({ purchaseDate: -1 });
      
    return NextResponse.json(servers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
