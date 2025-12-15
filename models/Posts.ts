import mongoose, { Document } from "mongoose";

interface IComment {
    user_id: mongoose.Types.ObjectId;
    user_name: string;
    comment: string;
    created_at: Date;
}

interface IPostDetails {
    image_url: string;
    caption?: string;
}

export interface IPost extends Document {
    user_id: mongoose.Types.ObjectId;
    post_details: IPostDetails;
    likes: string[];
    comments: IComment[];
    created_at: Date;
    profile_pic?: string;
    user_name: string;
}

const postsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_details: {
        image_url: { type: String, required: true },
        caption: { type: String }
    },
    likes: [{ type: String }],
    comments: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        user_name: { type: String },
        comment: { type: String },
        created_at: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
    profile_pic: { type: String },
    user_name: { type: String, required: true }
}, { timestamps: true })

const Posts =mongoose.models.posts || mongoose.model("posts",postsSchema)
export default Posts