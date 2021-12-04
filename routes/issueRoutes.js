const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
// const User = require('../models/userModel');
const Issue = require('../models/issueModel');
const issueController = require('../controllers/issueController');
const checkAuth = require('../middleware/authUser');

// add new issue
router.post('/add', checkAuth.verifyToken, issueController.addIssue);

// update issue
router.patch('/update/:id', checkAuth.verifyToken, issueController.updateIssue);

// get all issues
router.get('/getall', checkAuth.verifyToken, issueController.getAllIssues);

// get issue by id
router.get('/get/:id', checkAuth.verifyToken, issueController.getIssueById);

// get issue by status
router.get('/get/:status', checkAuth.verifyToken, issueController.getIssueByStatus);

// update issue
router.patch('/update/:id', checkAuth.verifyToken, issueController.updateIssue);

// remove issue
router.delete('/remove/:id', checkAuth.verifyToken, issueController.deleteIssue);

module.exports = router;
