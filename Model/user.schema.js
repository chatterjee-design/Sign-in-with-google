import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        googleId:String,
        displayName:String,
        email:String,
        image:String
    },
    {timestamps:true}
)

const User = model("User", userSchema);

export default User;