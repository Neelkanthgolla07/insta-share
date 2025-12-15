import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Posts from '@/models/Posts';
import connectionDatabase from '@/lib/mongoose';
import { IPost } from '@/models/Posts';
import User, { IUser } from '@/models/User';
import mongoose from 'mongoose';
// import { AuthOptions } from 'next-auth';

// Like/Unlike a post
export async function PUT(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }   

    await connectionDatabase();
    const { postId } =await  params;
    const post = await Posts.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }    

    const userName = session.user.name;
    const likeIndex = post.likes.indexOf(userName);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userName);
    }

    await post.save();

    return NextResponse.json({ 
      message: 'Success',
      likes: post.likes
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add comment to a post
export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectionDatabase();
    const user = await User.findOne({ name: session.user.name });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { comment } = await req.json();
    if (!comment || typeof comment !== 'string') {
      return NextResponse.json({ error: 'Invalid comment' }, { status: 400 });
    }
    const {postId} =await params;
    const post = await Posts.findById(postId);    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const newComment = {
      user_id: new mongoose.Types.ObjectId(user._id),
      user_name: user.name,
      comment,
      created_at: new Date()
    };

    post.comments.push(newComment);
    await post.save();
    
    return NextResponse.json({ 
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete a post
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectionDatabase();    const user = await User.findOne({ name: session.user.name }) as IUser;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const {postId} =await params;
    const post = await Posts.findById(postId) as IPost;
    if (!post || post.user_id.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Posts.findByIdAndDelete(postId);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
