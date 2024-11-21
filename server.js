const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const multer= require('multer');
const path = require('path');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5000;
const mysecretkey = "Abc123";
app.use(cors());
app.use(express.json());
function Authenticate(req, res, next) {
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
        await mongoose.connect("mongodb://localhost:27017/social_app", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Yes, MongoDB is connected");
    } catch (error) {
        console.log("It's not connecting", error);
    }
}
connection();

// User Schema
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

// Post Schema 

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Store the image path
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model("Post", postSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });




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
        // Generate OTP
        const otp = generate4DigitOTP();
        // Create new user with OTP
        const userdata = new User({
            ...userData,
            otp: otp,
        });
        await userdata.save();
        // Set up email options
        const mailOptions = {
            from: 'infoaliraza22@gmail.com',
            to: userData.email,
            subject: 'OTP Verification',
            text: `Hello ${userData.name},\n\nYour OTP for account verification is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
        };
        // Send OTP email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).json({ message: "Error sending OTP: " + error.message });
            }
            // Send success response
            res.status(200).json({ message: "Signup successful! Please verify your OTP." });
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(400).json({ message: "Error during signup: " + error.message });
    }
});
app.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json("User not found.");
        }
        if (user.otp === otp) {
            user.otpVerified = true;
            user.otp = undefined;
            await user.save();
            res.status(200).json("OTP verified successfully. Account is now active.");
        } else {
            res.status(400).json("Invalid OTP. Please try again.");
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
            return res.status(404).json("User not found");
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
                return res.status(500).json("Error sending OTP: " + error.message);
            }
            res.status(200).json("OTP sent successfully. Please verify your OTP.");
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(400).json("Error during password reset: " + error.message);
    }
});
app.post("/verifyotp/newpassword", async (req, res) => {
    const { email, otp,newpassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json("User not found.");
        }
        if (user.otp === otp) {
            user.otp = undefined;
            user.password = newpassword;
            await user.save();
            res.status(200).json("OTP verified successfully. Password is Changed.");
        } else {
            res.status(400).send("Invalid OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).send("Error verifying OTP: " + error.message);
    }
});



// Create Post API
app.post("/create-post", Authenticate, upload.single("image"), async (req, res) => {
    const { title, content } = req.body;

    try {
        // Validate input
        if (!title || !content) {
            return res.status(400).json("Title and content are required.");
        }

        // Create post
        const post = new Post({
            title,
            content,
            image: req.file ? req.file.path : null, // Save file path if uploaded
            user: req.user.id, // Add user reference from token
        });

        await post.save();
        res.status(201).json({
            message: "Post created successfully.",
            post,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json("Error creating post: " + error.message);
    }
});

// Serve Static Files (For Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// postSchema add  a field like 
postSchema.add({
    likes: {
        type: Number,
        default: 0, // Initialize with 0 likes
    },
});


// timeline api 
app.get("/timeline", Authenticate, async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching timeline:", error);
        res.status(500).json("Error fetching timeline: " + error.message);
    }
});

// profile posts
app.get("/profile", Authenticate, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json("Error fetching user posts: " + error.message);
    }
});



// update post
app.put("/profile/edit/:id", Authenticate, multer({ dest: "uploads/" }).single("image"), async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        // Find post by ID and check if it belongs to the logged-in user
        const post = await Post.findOne({ _id: postId, user: req.user.id });

        if (!post) {
            return res.status(404).json("Post not found or you are not authorized to edit this post.");
        }

        // Update post fields
        post.title = title || post.title;
        post.content = content || post.content;

        if (req.file) {
            post.image = req.file.path; // Update image if provided
        }

        await post.save();
        res.status(200).json({ message: "Post updated successfully.", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json("Error updating post: " + error.message);
    }
});

// delete post
app.delete("/profile/delete/:id", Authenticate, async (req, res) => {
    try {
        const postId = req.params.id;

        // Find and delete post if it belongs to the logged-in user
        const post = await Post.findOneAndDelete({ _id: postId, user: req.user.id });

        if (!post) {
            return res.status(404).json("Post not found or you are not authorized to delete this post.");
        }

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json("Error deleting post: " + error.message);
    }
});






app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});