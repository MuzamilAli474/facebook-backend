const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');


const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save OTP and expiration to database
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "jeramie.dicki@ethereal.email",
          pass: "jBRTRBdNugn34tRFDX",
        },
      });

    const mailOptions = {
      from: 'jeramie.dicki@ethereal.email',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email', error: err });
      }
      return res.status(200).json({ message: 'OTP sent to email' });
    });

  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err });
  }
};

// this is reset  start 

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    try {
    
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
    
      if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
     
      user.password = newPassword;
      user.otp = null; 
      user.otpExpiresAt = null; 
      await user.save();
  
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      return res.status(500).json({ message: 'Server Error', error: err });
    }
  };
  module.exports = {forgetPassword , resetPassword};
  