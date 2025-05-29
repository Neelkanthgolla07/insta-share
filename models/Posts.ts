import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";

const postsSchema = new mongoose.Schema({
    user_id: {type :String},
    post_details:{type:Object},
    post_id:{type :String},
    likes_count:{type:Number},
    comments:{type:Array<object>},
    created_at:{type :String},
    profile_pic:{type :String},
    user_name: {type :String},
    story_url:{type :String}
})

const Posts =mongoose.models.posts || mongoose.model("posts",postsSchema)
export default Posts