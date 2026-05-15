import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    const servers = await Server.find({ userId }).sort({ purchaseDate: -1 });
    return NextResponse.json(servers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const server = await Server.create(data);
    return NextResponse.json(server, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
