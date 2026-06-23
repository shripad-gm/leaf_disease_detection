import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    profilepic: {
        type: String,
        default: ""
    },
    resetOTP: {
        type: String,
        default: null
    },
    resetOTPExpires: {
        type: Date,
        default: null
    }
},
{timestamps:true})

const User=mongoose.model("User",userSchema)
export default User;