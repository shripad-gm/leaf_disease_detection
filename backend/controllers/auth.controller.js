import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/jwttoken.js";
import sendEmail from "../utils/sendEmail.js";

export const signup=async(req,res)=>{
    try{
        const {fullname,username,email,password,confirmpassword,gender}=req.body;

        if(!email){
            return res.status(400).json({error:"Email is required"});
        }

        if(password!==confirmpassword){
           return  res.status(400).json({error:"password doesnt match"});
        }

        const userByUsername=await User.findOne({username});
        if(userByUsername){
            return res.status(400).json({error:"Username already exists"})
        }

        const userByEmail=await User.findOne({email: email.toLowerCase()});
        if(userByEmail){
            return res.status(400).json({error:"Email is already registered"})
        }

        //hashing the password
        const salt=await bcrypt.genSalt(10);
        const hashedpass=await bcrypt.hash(password,salt);
        //setting profilepic
        const boyprofpic=`/default_boy.png`
        const girlprofpic=`/default_girl.png`

        const newUser= new User({
            fullname,
            username,
            email: email.toLowerCase(),
            password:hashedpass,
            gender,
            profilepic:(gender==="male")?boyprofpic:girlprofpic
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            return res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                email:newUser.email,
                gender:newUser.gender,
                profilepic:newUser.profilepic
            })
        }
        else{
            res.status(400).json({error:"invalid user"})
        }
    }
    catch(error){
        console.log("error in the signup contoller")
        res.status(400).json({error:"internal server error"})
    }
}

export const login=async(req,res)=>{
    try{
        const {username,password}=req.body;

        const user=await User.findOne({username})
        const ispassword=await bcrypt.compare(password,user?.password||"")

        if(!user || !ispassword){
            return res.status(400).json({error:"incorrect credentials"})
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            profilepic:user.profilepic,
            gender:user.gender,
        });
    }
    catch(error){
        console.log("error in the signup contoller")
        res.status(400).json({error:"internal server error"})
    }
}

export const logout=(req,res)=>{

    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out sucessfully"})
    }
    catch(error){
    console.log("error in the logout contoller")
    res.status(400).json({error:"internal server error"})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: "User with this email does not exist" });
        }

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetOTP = otp;
        user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send verification code email
        await sendEmail({
            to: email.toLowerCase(),
            subject: "Resilient Roots - Password Reset Verification Code",
            code: otp
        });

        res.status(200).json({ message: "Reset code sent! Please check your email inbox." });
    } catch (error) {
        console.log("Error in forgotPassword controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, code and new password are required" });
        }

        const user = await User.findOne({ 
            email: email.toLowerCase(),
            resetOTP: otp,
            resetOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset code" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear OTP fields
        user.resetOTP = null;
        user.resetOTPExpires = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};