import connectionDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectionDatabase();

    const { name, password }: { name: string; password: string } = await req.json();

    const newUser = new User({ name, password });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
