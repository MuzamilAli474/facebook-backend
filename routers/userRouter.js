const express = require('express');

const router = express.Router();
 const auth = require('../middlewares/auth.js')
const {singUp,sendotp,login,updatepassword} =require('../controllers/userController.js');


router.post('/singUp',singUp)

router.post('/sendotp',sendotp)

router.post('/login',login)


router.patch('/updatepassword/:userID',auth,updatepassword)











module.exports = router 