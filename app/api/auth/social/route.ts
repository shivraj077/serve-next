import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, firstName, lastName } = await req.json();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        email,
        firstName,
        lastName,
        password: 'social-auth-user', // Placeholder password
        role: 'user',
      });
    }

    return NextResponse.json({ 
      message: 'Social auth successful', 
      user: { id: user._id, email: user.email, firstName: user.firstName, role: user.role } 
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
