const userModel = require('../models/userModel');
const crypto = require('crypto'); // For generating random OTP
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const secretKey = "shhhhh1212121";

// Signup - Create user and send OTP
const signUp = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Generate OTP (6 digits random number)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Create a new user with OTP and expiration
    const newUser = await userModel.create({
      email,
      name,
      password,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    // Send OTP via email (using Nodemailer)
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jeramie.dicki@ethereal.email',
            pass: 'jBRTRBdNugn34tRFDX'
        }
    });

    const mailOptions = {
      from: 'jeramie.dicki@ethereal.email',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending OTP email', error: err });
      }
      return res.status(200).json({ message: 'OTP sent to email' });
    });

    return res.status(200).json({ message: 'Sign up successful. OTP sent to email.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err });
  }
};

// OTP Verification
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP has expired
    if (user.otpExpiresAt < Date.now()) {
      // OTP expired, delete it
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check if OTP is valid
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified successfully, set isVerified to true
    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    user.otpExpiresAt = null; // Clear expiration time
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully. Account activated.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err });
  }
};

const login= (req , res)=>{
    const email = req.body.email;
    const password = req.body.password;
    userModel
      .findOne({ email: email, password: password })
      .then((result) => {
        if (result) {
          var token = jwt.sign({ email: email , userId: result._id}, secretKey);
          return res.status(200).json({
            message: "login successful",
            token,
          });
        } else {
          return res.status(400).json({
            message: "something wrong",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Server Error",
        });
      });
  }

module.exports = { signUp, verifyOTP ,login };
