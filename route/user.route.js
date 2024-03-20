const express=require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserModel } = require("../model/user.model");

const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
const {name,email,password,isAdmin}=req.body;
let user=await UserModel.findOne({email});
if(user){return res.json({msg:"User already exists, Kindly Login with credentials!"})}
try {
    let hash=await bcrypt.hash(password,5);
    let newUser=new UserModel({name,email,password:hash,isAdmin});
    await newUser.save();
    res.status(201).json({msg:"New User Added"})
} catch (error) {
    res.status(400).json(error)
}
})


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    let user=await UserModel.findOne({email})
    if(!user){return res.status(400).json({msg:"User does not exists, kindly register the user"})}
    try {
        const match = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ userID: user._id }, 'masai');
        res.status(201).json({msg:"Login Successful!",token})
    } catch (error) {
        res.status(200).json({msg:"Wrong Credentidals"})
    }
})

module.exports={
    userRouter
}