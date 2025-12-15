import { NextResponse,NextRequest} from 'next/server';
import { getServerSession } from 'next-auth';
import Posts from '@/models/Posts';
import User from '@/models/User';
import connectionDatabase from '@/lib/mongoose';

// type RouteContext={ params: { postId: string } }

export async function PUT(
  req: NextRequest,
  context : { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { caption } = body;

    await connectionDatabase();

    const user = await User.findOne({ name: session.user.name });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await Posts.findById(context.params.postId);
    if (!post || post.user_name !== session.user.name) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }

    post.post_details.caption = caption;
    await post.save();

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}