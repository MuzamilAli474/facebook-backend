
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

//login user post 
const viewPost = async( req , res )=>{

 try {
    const userId =   req.userId;
    if(!userId){
       return res.status(400).json({
           message: "Not login "
       })
    }
  const post = await Post.find({userId});
  
  return res.status(200).json({ post });
 } catch (error) {
    res.status(500).json({ message:'Internal server error!' });
 }

}
//other user post
const postsFOrtimeline = async( req , res )=>{

    try {
        
        const userId = req.userId;
        if (!userId) {
          return res.status(400).json({
            message: "Not logged in"
          });
        }
    
        const posts = await Post.find();
        if (posts.length === 0) {
            return res.status(404).json({
              message: "Post not found"
            });
          }else{
      
        return res.status(200).json({ posts });
          }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error!' });
      }


}

const updatePost = async ( req , res )=>{
    
        const postId = req.params.postId;
        const  userId =   req.userId;
        try {
            const post = await Post.findById(postId);

            if (!post) {
                console.log('No post found with ID:', postId);
                return res.status(404).json({ message: 'Post not found' });
            }
    
            if (post.userId.toString() !== userId) {  
                return res.status(403).json({ message: 'You are not authorized to update this post' });
            }
    

 



            const updatedData = {
                title: req.body.title,
                content: req.body.content,
                photo: req.file ? req.file.path : undefined,  
            };
    
            console.log('Updated Data:', updatedData);
    
            const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });
    
            if (!updatedPost) {
                console.log('No post found with ID:', postId);
                return res.status(404).json({ message: 'Post not found' });
            }
    
            res.json(updatedPost);
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Error updating post' });
        }
}


const deletePost = async (req, res)=>{
    const {postId}  = req.params;
  console.log(postId)
    try {
     

        
        const post = await Post.findById({ _id: postId, userId: req.userId });
        console.log(post)

        if (!post) {
            return res.status(404).json({ message: 'Post not found or you are not authorized to delete this post' });
        }
 
        await Post.deleteOne({ _id: postId });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting post' });
    }
}



const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;   
        const { commentContent } = req.body;  
        const userId = req.userId;   

        // console.log(postId, commentContent, userId);
 
        if (!commentContent) {
            return res.status(400).json({ message: 'Comment content is required' });
        }
 
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

       
        post.commentedBy.push({
            userId: userId,
            comment: commentContent,   
            createdAt: Date.now(),
        });

         
        post.comments = (post.comments) + 1;

         
        await post.save();

        return res.status(200).json({
            message: 'Comment added successfully!',
            post,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

// like by login user i want to dislike if usr already like this post
const likePost = async (req, res) => {
try {
    const userId= req.userId;
    if(!userId) {
       return res.status(401).json({ message: 'User not logged in' });
    }
     postId = req.params.postId;
   
   
     const post = await Post.findById(postId); 
     if(!post) {    
 return res.status(404).json({ message: 'Post not found' });
     }

     if(post.likedby.includes(userId)){
        post.likes -= 1;   
        post.likedby.remove(userId);   
        await post.save();
        return res.status(200).json({ message: 'Post disliked successfully!', post });


 

     }else{
        post.likes += 1;   
        post.likedby.push(userId);   
        await post.save();
        return res.status(200).json({ message: 'Post liked successfully!', post });
     }

 


     
   //   console.log(post); 
   
   
} catch (error) {
    return res.status(500).json({ message:'internal  server error', error});
}
}



module.exports ={createPost,uploads,viewPost,postsFOrtimeline,updatePost,deletePost,addComment,likePost}