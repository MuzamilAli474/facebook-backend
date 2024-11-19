const mongoose = require('mongoose'); 
//   now schema started
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
      },
    name: {
        type: String,
        required: true,
        
      },
  
    password: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        // required: true,
      },
      otpExpiresAt: {
        type: Date,
        // required: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
  
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
  
  userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });
  const userModel = mongoose.model("SignUp-Users", userSchema);
  
  module.exports = userModel;