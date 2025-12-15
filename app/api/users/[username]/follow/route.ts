import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import connectionDatabase from '@/lib/mongoose';

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUsername = session.user.name;
    const targetUsername = params.username;

    if (currentUsername === targetUsername) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    await connectionDatabase();

    // Check if both users exist
    const [currentUser, targetUser] = await Promise.all([
      User.findOne({ name: currentUsername }),
      User.findOne({ name: targetUsername })
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already following
    if (currentUser.following.includes(targetUsername)) {
      return NextResponse.json({ error: 'Already following' }, { status: 400 });
    }

    // Update both users
    await Promise.all([
      User.updateOne(
        { name: currentUsername },
        { $addToSet: { following: targetUsername } }
      ),
      User.updateOne(
        { name: targetUsername },
        { $addToSet: { followers: currentUsername } }
      )
    ]);

    return NextResponse.json({ 
      message: 'Successfully followed user',
      following: true 
    });
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUsername = session.user.name;
    const targetUsername = params.username;

    await connectionDatabase();

    // Remove from following/followers lists
    await Promise.all([
      User.updateOne(
        { name: currentUsername },
        { $pull: { following: targetUsername } }
      ),
      User.updateOne(
        { name: targetUsername },
        { $pull: { followers: currentUsername } }
      )
    ]);

    return NextResponse.json({ 
      message: 'Successfully unfollowed user',
      following: false 
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}