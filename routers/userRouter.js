const express = require('express');

const router = express.Router();
 const auth = require('../middlewares/auth.js')
const {singUp,sendotp,login,updatepassword,forgotpassword} =require('../controllers/userController.js');


router.post('/singUp',singUp)

router.post('/sendotp',sendotp)

router.post('/login',login)


router.patch('/updatepassword/:userID',auth,updatepassword)


router.post('/forgotpassword',forgotpassword);








module.exports = router 