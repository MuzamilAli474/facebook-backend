const express = require('express');
const router = express.Router();

const { signUp , verifyOTP ,login} = require('../controllers/userController');

router.post('/signUp' , signUp);
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);


module.exports = router;