const User = require('../models/userModel.js');

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const router = require('../routers/userRouter.js');


const secretKey ="12345";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true for port 465, false for other ports
    auth: {
        user: 'muzamil.6aug24webgpt@gmail.com',  
        pass: 'cjcy cync rjsh srix' 
    }
});
 


function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();  
}
const sendotp =  async (req, res) => {
    const { email } = req.body;
  
    const otp = generateOTP();
   

    const mailOptions = {
        from: 'muzamil.6aug24webgpt@gmail.com',
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        res.status(500).json({ error: 'Error sending OTP' });
    }



};

 const singUp = async(req ,res )=>{
  
    console.log(req.body)
    try {
       const {name,email,password} = req.body;
   
   const  user = await User.findOne({email});
   // console.log(req.body)
   if(user){
       return res.status(400).json({
           message:"User is already Register!"
       })
   }
    
   
   
   const newUser= await User.create({
       name,
       email,
       password,
       
       
      
   })
   // console.log(newUser)
    
   return res.status(200).json({
       newUser,
       message:"User is Register sucessfully!"
   })
   
   
   
    } catch (error) {
      res.status(500).json({
        message:"Internal server error!"
     })
    }
   

 }




 const login = async (req, res)=>{
    try {
       const {email,password} = req.body;
       // console.log(req.body)
     const userData = await User.findOne({ email , password })
   //   console.log(userData)
    if(!userData){
       return res.status(400).json({
           message:"No data found!"
       })
    } 
   if(userData.email==req.body.email && userData.password==req.body.password){
   
       const token = jwt.sign({email:userData.email,id:userData._id},secretKey);
   
       return res.status(200).json({
          
           userData,
           token,
           message:"User login Sucessfully!"
       })
   
   
   
   
   }
   
    } catch (error) {
   
       return  res.status(5000).json({
   
           message:'Internal server error!'
       })
       
    }
   
   
   };










module.exports ={singUp,sendotp,login}