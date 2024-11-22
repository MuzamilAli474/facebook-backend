const express = require('express');

const router = express.Router();

const  auth = require('../middlewares/auth');
  

 const {createPost,uploads,viewPost,postsFOrtimeline,updatePost,deletePost,addComment,likePost}  = require('../controllers/postController');
 
 router.post('/createPost',auth,uploads.single('photo'),createPost)
  
 router.get('/viewPost',auth,viewPost)


 router.get('/postsFOrtimeline',auth,postsFOrtimeline)


 router.patch('/updatePost/:postId',auth,updatePost)


 router.delete('/deletePost/:postId',auth,deletePost)

 router.post('/addComment/:postId',auth,addComment)


router.post('/likePost/:postId',  auth,likePost)













module.exports = router 