const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const shortid = require('shortid');
// const validator = require('validator');
// const authModel = require('../models/authModel');
const User = require('../models/userModel');
// const token = require('../middleware/authUser');
// const checkUtils = require('../utilities/checkUtils');
// const passwordUtils = require('../utilities/generatePassword');
const mailerUtil = require('../utilities/mailerUtil');

exports.registerUser = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail Exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err })
                    } else {
                        const newUser = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            email: req.body.email
                        });
                        newUser
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(200).json({
                                    message: "User Registered"
                                    // user: result
                                });
                                mailerUtil.registerMail(req.body.email, req.body.username);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
};

exports.loginUser = (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// let registerUser = (req, res) => {
//     // validate user input
//     let validateUserInput = () => {
//         return new Promise((resolve, reject) => {
//             if (req.body.email) {
//                 if (!validator.isEmail(req.body.email)) {
//                     res.status(400).json({
//                         success: false,
//                         message: 'Invalid Email'
//                     });
//                     reject(res);
//                 }
//             } else if (checkUtils.isEmpty(req.body.username) || checkUtils.isEmpty(req.body.password) || checkUtils.isEmpty(req.body.email)) {
//                 res.status(400).json({
//                     success: false,
//                     message: 'one or more required fields missing'
//                 });
//                 reject(res);
//             } else resolve(req);
//         });
//     };
//     // create user
//     let createUser = () => {
//         return new Promise((resolve, reject) => {
//             userModel.findOne({ username: req.body.username })
//                 .exec((err, user) => {
//                     if (err) {
//                         res.status(500).json({
//                             success: false,
//                             message: 'User creation failed.'
//                         }); reject(res);
//                     } else if (checkUtils.isEmpty(user)) {
//                         console.log(req.body);
//                         let newUser = new userModel({
//                             userId: shortid.generate(),
//                             username: req.body.username,
//                             password: passwordUtils.hashPass(req.body.password),
//                             email: req.body.email
//                         });
//                         newUser.save((err, newUser) => {
//                             if (err) {
//                                 console.log(err);
//                                 res.status(500).json({
//                                     success: false,
//                                     message: 'new user creation failed'
//                                 });
//                                 reject(res);
//                             } else {
//                                 let newUserObj = newUser.toObject();
//                                 resolve(newUserObj);
//                             }
//                         });
//                     } else {
//                         res.status(403).json({
//                             success: false,
//                             message: 'user already exists with this email.'
//                         }); reject(res);
//                     }
//                 });
//         });
//     };
//     let sendRegisterMail = () => {
//         let email = req.body.email;
//         let username = req.body.username;
//         mailerUtil.registerMail(email, username);
//     };
//     validateUserInput(req, res)
//     .then(createUser)
//     .then((resolve) => {
//         sendRegisterMail();
//         delete resolve.password;
//         res.status(200).json({
//             success: true,
//             message: 'User Registered'
//         })
//     })
//     .catch((err) => {
//         console.log(err);
//         res.status(500).json({
//             success: false, 
//             message: err
//         })
//     })
// };

// // let loginUser = (req, res) => {

// // };

// // let getAllUsers = (req, res) => {
// //     userModel.find()
// //         .select(' -__v -_id -password')
// //         .lean()
// //         .exec((err, result) => {
// //             if (err) {
// //                 console.log(`Error in Getting All Users: ${err}`);
// //                 res.status(500).json({
// //                     success: false,
// //                     message: err
// //                 });
// //             } else if (checkUtils.isEmpty(result)) {
// //                 res.status(404).json({
// //                     success: false,
// //                     message: 'No User Found'
// //                 });
// //             } else {
// //                 res.status(200).json({
// //                     success: true,
// //                     message: 'Get All user details successful.'
// //                 });
// //             }
// //         });
// // };

// // let updateUser = (req, res) => {
// //     let options = req.body;
// //     userModel.updateOne({ 'userId': req.params.userId }, options).select('-__v -password -_id')
// //         .exec((err, result) => {
// //             if (err) {
// //                 console.log(err);
// //                 res.status(500).json({
// //                     success: false,
// //                     message: 'update user details failed'
// //                 });
// //             } else if (checkUtils.isEmpty(result)) {
// //                 res.status(404).json({
// //                     success: false,
// //                     message: 'User not found'
// //                 });
// //             } else {
// //                 res.status(200).json({
// //                     success: true,
// //                     message: 'edit user successful'
// //                 });
// //             }
// //         });
// // };

// module.exports = {
//     register: registerUser,
//     login: loginUser
//     // getall: getAllUsers,
//     // update: updateUser,
//     // remove: removeUser,
//     // logout: logoutUser
// };

