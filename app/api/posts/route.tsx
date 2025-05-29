import connectionDatabase from '@/lib/mongoose';
import Posts from '@/models/Posts';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface PostData {
  user_id: string;
  post_details: object;
  post_id: string;
  likes_count: number;
  comments: Array<object>;
  created_at: string;
  user_name: string;
  story_url: string;
  profile_pic: string;
}


export async function POST(req: NextRequest) {
  try {
    await connectionDatabase();

    const {posts}:{posts:PostData[]}= await req.json()
    const savedPosts=await Promise.all( posts.map(async (element:PostData) => {
        const { user_id,
        post_details
        ,post_id, 
        likes_count,
        comments,
        created_at,
        user_name,
        story_url ,
        profile_pic
    }: { user_id: string,
        post_details:object,
        post_id:string,
        likes_count:number,
        comments:Array<object>,
        created_at:string,
        profile_pic:string,
        user_name: string,
        story_url:string } = element;

    const newPosts = new Posts({ user_id,
        post_details
        ,post_id, 
        likes_count,
        comments,
        created_at,
        user_name,
        story_url ,
        profile_pic
    });
    return await newPosts.save();
    }));
    
    return NextResponse.json({ message: "All posts created successfully", posts: savedPosts }, { status: 201 });
    
    
    // return NextResponse.json(newStories, { status: 201 });
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}






export async function GET() {
  try {
    await connectionDatabase();
    const posts = await Posts.find({}).sort({ created_at: -1 }); // Sort by newest first
    return NextResponse.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
