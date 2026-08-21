import { NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/sqlite';

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName } = await req.json();

    // Check if user already exists
    let user = findUserByEmail(email);

    if (!user) {
      // Create new user if they don't exist
      user = createUser({
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

