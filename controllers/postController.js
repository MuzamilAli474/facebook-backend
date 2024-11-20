
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const secretKey ="12345";
const multer = require ('multer');
const fs = require('fs');
const path = require ('path');
const Post = require('../models/postModel');

const dir = './uploads/psotPhoto';
 if (!fs.existsSync(dir)) {
     fs.mkdirSync(dir);
 }
 
  
 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, dir);  
     },
     filename: (req, file, cb) => {
         cb(null, file.originalname);
     }
   
 });
 
 const uploads = multer({ storage: storage });



const createPost =  async( req, res )=>{
try {
    const userId = req.userId;

    // console.log(userId)

    const { title, content } = req.body;
    console.log(req.body)
   
    const photo = req.file.path;
    console.log(photo)
    if(!photo){
        return res.status(400).json({
            message:"File not founds that you want to upload!"
        })
    }
    const newPost = new Post({ title, content, photo ,userId});
    await newPost.save();
    console.log(newPost)

    res.status(201).json({ message: 'Post created successfully', newPost });

} catch (error) {
    res.status(500).json({ message:'Internal server error!' });
}


     
}

// timeline insted of login user 
const viewPost = async( req , res )=>{
  

}






module.exports ={createPost,uploads,viewPost}