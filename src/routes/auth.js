const express=require("express");
const authRouter=express.Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const{ validateSignUpData }= require("../utils/validations");
const jwt=require("jsonwebtoken");
authRouter.post("/signup",async (req,res)=>{
try{
validateSignUpData(req);
const{password}=req.body;
const passwordHash=await bcrypt.hash(password,10);
 const user=new User(
    {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        emailId:req.body.emailId,
        password:passwordHash
    }
 );
 const savedUser=await user.save();
  const token=await savedUser.getJWT();
            res.cookie("token",token);
 res.json({data: savedUser});
}
catch(err){
    res.status(400).send(err.message)
}
});
authRouter.post("/login",async (req,res)=>{
    try{
        const{ emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("email not present in db");
        }
        const isPasswordValid=await user.validPassword(password);
        if(isPasswordValid){
            const token=await user.getJWT();
            res.cookie("token",token);
            res.send(user);
        }
        else{
            throw new Error("password not correct");
        }
    }
    catch(err){
        res.status(400).send(err.message)
    }
});
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("logout");
});

module.exports={authRouter,}