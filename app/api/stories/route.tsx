import connectionDatabase from '@/lib/mongoose';
import Stories from '@/models/Stories';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';




export async function POST(req: NextRequest) {
  try {
    await connectionDatabase();

    const { user_id, user_name,story_url }: { user_id: string; user_name: string,story_url:string } = await req.json();

    const newStories = new Stories({ user_id, user_name,story_url });
    await newStories.save();

    return NextResponse.json(newStories, { status: 201 });
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}





export async function GET() {
  try {
    await connectionDatabase();
    const stories = await Stories.find({});
    return NextResponse.json(stories);
  } catch (err) {
    console.error('Error fetching stories:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}