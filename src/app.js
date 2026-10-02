const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { ReturnDocument } = require('mongodb');
const cors = require("cors");
const http = require("http");
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:[ "http://localhost:5173",
    "https://linkup-web.sansarkakkar07.workers.dev",
    ],
    credentials: true
}));
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const intializeSocket = require('./utils/socket');
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

const server = http.createServer(app);
intializeSocket(server);
connectDB().then(() => {
    console.log("db connected");
    server.listen(3000, () => {
        console.log("server running on port 3000");
    });
})
    .catch((err) => {
        console.log("db error");
    });


























// const express=require('express');
// const app=express();
// const {admin}=require('./middleware/auth')
// app.get('/admin',admin,(req,res)=>{
//     res.send('user valid');
// })
// app.listen(3000,()=>{
//     console.log('port 3000');
// });

// app.get("/feed",async (req,res)=>{
//     const name=req.body.firstName;
//     try{
//         const user=await User.find({firstName:name});
//         res.send(user)
//     }
//     catch(err){
//         res.status(400).send("404");
//     }

// });
// app.get("/feed",async (req,res)=>{
//     try{
//         const user=await User.find({});
//         res.send(user)
//     }
//     catch(err){
//         res.status(400).send("404");
//     }

// });
// app.delete("/feed",async (req,res)=>{
//     const id=req.body.userId;
//     try{
//         const user=await User.findByIdAndDelete(id);
//         res.send("user deleted succesfully");
//     }
//     catch(err){
//         res.status(400).send("404");
//     }

// });
// update data of the user
// app.patch("/user",async(req,res)=>{
//     const id=req.body.userId;
//     try{
//         const user=await User.findByIdAndUpdate(id,{firstName:"sansar kakkar"});
//         res.send("user updated succesfully");
//     }
//     catch(err){
//         res.status(400).send("404");
//     }
// })
// updateing data at once

// app.patch("/user",async(req,res)=>{
//     const id=req.body.userId;
//     const data=req.body;

//     try{
//         const allowed=['password','gender','firstName','lastName']
//         const isAllowed=Object.keys(data).every((k)=>{
//             return allowed.includes(k)
//         });
//         if(!isAllowed){
//             throw new Error("update not allowed");
//         }
//         const user=await User.findByIdAndUpdate(id,data,{returnDocument:"after",runValidators:true});
//         console.log(user);
//         res.send("user updated succesfully");
//     }
//     catch(err){
//         res.status(400).send(err.message);
//     }
// })