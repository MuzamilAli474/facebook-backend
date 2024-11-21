const express = require('express');

const router = express.Router();

const  auth = require('../middlewares/auth');
  

 const {createPost,uploads,viewPost,postsFOrtimeline,updatePost,deletePost}  = require('../controllers/postController');
 
 router.post('/createPost',auth,uploads.single('photo'),createPost)
  
 router.get('/viewPost',auth,viewPost)


 router.get('/postsFOrtimeline',auth,postsFOrtimeline)


 router.patch('/updatePost/:postId',auth,updatePost)


 router.delete('/deletePost/:postId',auth,deletePost)

















module.exports = router 