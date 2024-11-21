const express = require('express');
const router = express.Router();

const {postCreate , showData ,allPosts} = require("../controllers/createPost");
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/multerMiddleware'); 



router.post("/postCreate" , authenticate ,  upload.single('image'), postCreate);
router.get('/showPost' , authenticate , showData);
router.get('/allPost' , authenticate , allPosts);



module.exports = router ;