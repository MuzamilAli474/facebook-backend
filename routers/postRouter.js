const express = require('express');

const router = express.Router();

const  auth = require('../middlewares/auth');
  

 const {createPost,uploads,viewPost}  = require('../controllers/postController');


 router.post('/createPost',auth,uploads.single('photo'),createPost)
  
 router.get('/viewPost',viewPost)


















module.exports = router 