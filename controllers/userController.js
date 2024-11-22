const User = require('../models/userModel.js');

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const router = require('../routers/userRouter.js');
const {generateRandomPassword,sendEmail} = require('../middlewares/mailer.js')

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





   const updatepassword= async (req, res )=>{
   
    try {

        const userID = req.params.userID;
        const {newpassword} = req.body;
         const { oldpassword } = req.body;
        //  console.log(userID);
        //  console.log(newpassword);
        //  console.log(oldpassword);
        const studentIdbyauth =  req.userId;
        // console.log(studentIdbyauth)
        const  user = await User.findById(userID);
        if(!user){
            return res.status(404).json({
                message:"User Not Found ! that you want to aupdate Password"
            })
        }

        if(user._id.toString() !== studentIdbyauth){
            return  res.status(403).json({
        
                message :" You are not authorized to Update  Password ."
            })
        }
        if(user.password !== req.body.oldpassword ){
            return  res.status(403).json({
        
                message :"  please check your oldPassword and try again ."
            })
        
         }else{

            const updatePass = await User.findByIdAndUpdate(userID,{password:newpassword,new:true})
        
            
            return  res.status(200).json({
                updatePass,
                message :"your password is Updated successfully! "
            })
        
        
         }

        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
   
   
   
   
   }



 

const forgotpassword = async (req, res) => {
 
  try {
    const {email} = req.body;


 const user = await User.findOne({email})   
if(!user){
    return res.status(404).json({
        message:"No user found with this email!"
    })
}else if(user){
  const generateRandomPasswords =   generateRandomPassword(10)
//   console.log("Generating random passwords: " + generateRandomPasswords)
    await User.findByIdAndUpdate(user._id, { password: generateRandomPasswords });
    sendEmail(email, `Your new password is: ${generateRandomPasswords}`);
    return res.status(200).json({
        message: "Password reset email sent successfully!"
    });  } 
}catch (error) {
    return res.status(500).json({
        message: "Error resetting password!"
    });
  }
}









module.exports ={singUp,sendotp,login,updatepassword,forgotpassword}