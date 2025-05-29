import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";

const storiesSchema = new mongoose.Schema({
    user_id: {type:String ,unique: true},
    user_name: {type :String},
    story_url:{type :String}
})

const Stories =mongoose.models.Stories || mongoose.model("Stories",storiesSchema)
export default Stories