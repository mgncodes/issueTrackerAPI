const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const mailerUtil = require('../utilities/mailerUtil');
require('dotenv').config('../.env');
const checkAuth = require('../middleware/authUser');
const passwordUtil = require('../utilities/generatePassword');

exports.registerUser = async (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined || req.body.email === undefined) {
        res.status(403).json({
            success: false,
            error: 'One or more required fields missing.'
        })
    }
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    success: false,
                    error: 'Account already exists for this email.'
                });
            } else {
                hashedPassword = passwordUtil.hashPassword(req.body.password);
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.username,
                    password: hashedPassword,
                    email: req.body.email
                });
                newUser
                    .save()
                    .then(result => {
                        console.log("User Registered");
                        res.status(200).json({
                            success: true,
                            message: result
                        });
                        mailerUtil.registerMail(req.body.email, req.body.username);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            success: false,
                            error: err
                        });
                    });
            }
        });
}

exports.loginUser = (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(403).json({
            success: false,
            error: 'One or more required fields missing.'
        })
    }
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user === null) {
                console.error('User not found.');
                return res.status(404).json({
                    success: false,
                    error: 'User Not found'
                });
            }
            passwordUtil.comparePassword(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.error('Incorrect password.');
                    return res.status(403).json({
                        success: false,
                        error: 'Incorrect Password.'
                    });
                }
                if (result) {
                    const token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.JWT_ACCESS_EXP });
                    // const refreshToken = generateRefreshToken(user[0].username);
                    console.log(`User with username ${req.body.username} login successful.`);
                    return res.status(200).json({
                        success: true,
                        message: "User Login Successful.",
                        token: { token/*, refreshToken*/ }
                    });
                }
                console.log(`Auth Failed.`);
                res.status(401).json({
                    success: false,
                    message: 'Auth failed.'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                error: err
            });
        });
};

exports.getAllUsers = async (req, res, next) => {
    await User.find({})
        .exec()
        .then(docs => {
            if (!docs) {
                console.error('No users found');
                res.status(404).json({
                    success: false,
                    message: 'No users found.'
                });
            }
            console.log(`Get all users successful.`);
            res.status(200).json({
                success: true,
                message: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.updateUser = (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined || req.body.email === undefined) {
        res.status(400).json({
            success: false,
            error: 'required fields missing'
        }); next();
    }
    const un = req.params.username;
    User.findOneAndUpdate({ username: un }, { $set: req.body })
        .exec()
        .then(result => {
            // if(!result) {
            //     res.status(404).json({
            //         success: false,
            //         error: `User not found`
            //     });    
            // }
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
                error: err
            });
        });
};

exports.removeUser = async (req, res, next) => {
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
                    success: false,
                    error: err
                });
            });
};

exports.logoutUser = (req, res, next) => {
    let token = req.headers["x-access-token"];
    console.log(token)
    // const userId = req.userData.sub;
    // redisClient.del(un.toString());
    // redisClient.set()
    token = undefined;
    res.status(200).json({
        success: true,
        message: 'User Logout successful.'
    });
};
