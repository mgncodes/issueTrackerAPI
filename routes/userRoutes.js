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

// update user
router.patch('/update/:username', (req, res, next) => {
    if (checkAuth) {
        if (req.body.username === undefined || req.body.password === undefined || req.body.email === undefined) {
            res.status(400).json({
                success: false,
                message: 'required fields missing'
            }); next();
        }
        const un = req.params.username;
        User.updateOne({ username: un }, { $set: req.body })
            .exec()
            .then(result => {
                console.log(`User with username ${un} update successful.`);
                res.status(200).json({
                    success: true,
                    message: result
                });
            })
            .catch(err => {
                console.log(`Error in updating user`);
                res.status(400).json({
                    success: false,
                    message: err
                });
            });
    }
});

// remove user
router.delete('/remove/:username', (req, res, next) => {
    if (checkAuth) {
        const un = req.params.username;
        User.remove({ username: un })
            .exec()
            .then(result => {
                console.log(`User with username ${un} deleted`);
                res.status(200).json({
                    success: true,
                    result: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
});

// get all users
router.get('/getall', (req, res, next) => {
    if (checkAuth) {
        User.find()
            .exec()
            .then(docs => {
                console.log(`Get all users successful.`);
                res.status(200).json({
                    success: true,
                    message: docs
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
});

module.exports = router;