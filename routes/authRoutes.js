const express = require('express');
const router = express.Router();
const {registerUser,LoginUser, LogoutUser} = require('../controllers/userController');

router.post('/register',registerUser);
router.post('/login', LoginUser);
router.post('/logout', LogoutUser);
module.exports = router;