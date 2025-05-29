import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema({
    name: {type:String ,unique: true},
    password: {type :String}
})

const User =mongoose.models.User || mongoose.model("User",userSchema)
export default User