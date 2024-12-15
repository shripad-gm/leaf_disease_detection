import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/jwttoken.js";

export const singup=async(req,res)=>{
    try{
        const {fullname,username,password,confirmpassword,gender}=req.body;

        if(password!==confirmpassword){
           return  res.status(400).json({error:"password doesnt match"});
        }

        const user=await User.findOne({username});

        if(user){
            return res.status(400).json({error:"user allready exist"})

        }

        //hashing the password
        const salt=await bcrypt.genSalt(10);
        const hashedpass=await bcrypt.hash(password,salt);
        //setting profilepic
        const boyprofpic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlprofpic=`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser= new User({
            fullname,
            username,
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
            profilepic:user.profilepic,
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