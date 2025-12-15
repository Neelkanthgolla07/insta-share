import { NextResponse } from "next/server";
import Posts from "@/models/Posts";
import { getServerSession } from "next-auth";
import connectionDatabase from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectionDatabase();
        const { image_url, caption } = await req.json();
        const user = await User.findOne({ name: session?.user?.name });
        console.log(user)
        const newPost = new Posts({
            user_id: user._id,
            post_details: {
                image_url,
                caption
            },
            user_name: user.name,
            profile_pic: user.profile_pic || "/avatar.png"
        });

        await newPost.save();
        return NextResponse.json({ message: "Post created successfully" }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectionDatabase();
        const posts = await Posts.find().sort({ created_at: -1 });
        return NextResponse.json(posts);
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
