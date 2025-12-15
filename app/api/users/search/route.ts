import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import connectionDatabase from '@/lib/mongoose';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    await connectionDatabase();
    
    const currentUser = await User.findOne({ name: session.user.name });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const users = await User.find({
      name: { $regex: query, $options: 'i' },
      _id: { $ne: currentUser._id } // Exclude current user
    }).select('name profile_pic').limit(10);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
