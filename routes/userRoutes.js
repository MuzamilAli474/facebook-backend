const express = require('express');
const router = express.Router();

const { signUp , verifyOTP ,login} = require('../controllers/userController');
const { forgetPassword  , resetPassword } = require('../controllers/forgetPassword');

router.post('/signUp' , signUp);
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);


module.exports = router;