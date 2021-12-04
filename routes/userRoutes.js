const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const checkAuth = require('../middleware/authUser');
const userController = require('../controllers/userController');

// signup
router.post('/register', userController.registerUser);

// login
router.post('/login', userController.loginUser);

// get all users 
router.get('/getall', checkAuth.verifyToken, userController.getAllUsers);

// update user
router.patch('/update/:username', checkAuth.verifyToken, userController.updateUser);

// remove user
router.delete('/remove/:username', checkAuth.verifyToken, userController.removeUser);

// logout user
router.post('/logout', checkAuth.verifyToken, userController.logoutUser);

module.exports = router;
