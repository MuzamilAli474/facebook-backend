const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const multer= require('multer');
const path = require('path');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = 6000;
const mysecretkey = "Abc123";
app.use(cors());
app.use(express.json());


function check(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).send("There is no token");
    }
    try {
        const decodedata= jwt.verify(token, mysecretkey); 
        req.user = decodedata;
        next(); 
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}
function generate4DigitOTP() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}



async function connection() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Socialapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Yes, MongoDB is connected");
    } catch (error) {
        console.log("It's not connecting", error);
    }
}
connection();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 2
    },
    otp: {
        type: String,
        required: false, 
    },
    otpVerified: {
        type: Boolean,
        default: false, 
    },
});
const User = mongoose.model("User", userSchema);

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'infoaliraza22@gmail.com',
        pass: 'ievm lijm hsex xjkc'   
    }
});


app.post("/signup", async (req, res) => {
    const userData = req.body;
    try {
        const otp = generate4DigitOTP();
        const userdata = new User({
            ...userData,
            otp: otp, 
        });
        await userdata.save();

        const mailOptions = {
            from: 'infoaliraza22@gmail.com',
            to: userData.email,
            subject: 'OTP Verification',
            text: `Hello ${userData.name},\n\nYour OTP for account verification is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).send("Error sending OTP: " + error.message);
            }
            res.status(200).send("Signup successful! Please verify your OTP.");
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(400).send("Error during signup: " + error.message);
    }
});

app.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        if (user.otp === otp) {
            user.otpVerified = true; 
            user.otp = undefined;
            await user.save();

            res.status(200).send("OTP verified successfully. Account is now active.");
        } else {
            res.status(400).send("Invalid OTP. Please try again.");
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).send("Error verifying OTP: " + error.message);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.password !== password && user.otpVerified!==false) {
            return res.status(401).send("Invalid password or otp not verified");
        }

        const token = jwt.sign({ email: user.email,id:user._id }, mysecretkey);
        res.status(200).json({
            message: "User is logged in",
            token: token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(400).send("Error logging in user: " + error.message);
    }
});


app.post("/forgetpassword", async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });


        if (!user) {
            return res.status(404).send("User not found");
        }


        const otp = generate4DigitOTP();

   
        user.otp = otp;

        await user.save(); 

  
        const mailOptions = {
            from: 'infoaliraza22@gmail.com',
            to: user.email,
            subject: 'OTP Verification',
            text: `Hello ${user.name},\n\nYour OTP for new password is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).send("Error sending OTP: " + error.message);
            }
            res.status(200).send("OTP sent successfully. Please verify your OTP.");
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(400).send("Error during password reset: " + error.message);
    }
});

app.post("/verifyotp/newpassword", async (req, res) => {
    const { email, otp,newpassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        if (user.otp === otp) {
            user.otp = undefined;
            user.password = newpassword;
            await user.save();

            res.status(200).send("OTP verified successfully. Password is Changed.");
        } else {
            res.status(400).send("Invalid OTP. Please try again.");
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).send("Error verifying OTP: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});