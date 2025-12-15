import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    followers: string[];
    following: string[];
}

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    followers: {
    type: [String], // Array of usernames
    default: []
    },
    following: {
      type: [String], // Array of usernames
      default: []
    }
}, { timestamps: true })

const User =mongoose.models.User || mongoose.model("User",userSchema)
export default User