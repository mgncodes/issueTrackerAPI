// // const { Int32, ObjectId } = require('bson');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
// const User = require('../models/userModel');
const Issue = require('../models/issueModel');
const issueController = require('../controllers/issueController');
const checkAuth = require('../middleware/authUser');

// add new issue
router.post('/add', issueController.addIssue);

// update issue
router.patch('/update/:id', issueController.updateIssue);

// get all issues
router.get('/getall', issueController.getAllIssues);

// get issue by id
router.get('/get/:id', issueController.getIssueById);

// get issue by status
router.get('/get/:status', issueController.getIssueByStatus);

// update issue
router.patch('/update/:id', issueController.updateIssue);

// remove issue
router.delete('/remove/:id', issueController.deleteIssue);

module.exports = router;