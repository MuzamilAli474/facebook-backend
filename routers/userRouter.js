const express = require('express');

const router = express.Router();

const {singUp,sendotp,login} =require('../controllers/userController.js');


router.post('/singUp',singUp)

router.post('/sendotp',sendotp)

router.post('/login',login)














module.exports = router 