const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
// const User = require("../models/userModel");
require('dotenv').config('../.env');
const checkAuth = require('../middleware/authUser');
const redisClient = require('../utilities/redisUtil');

// add new issue
exports.addIssue = (req, res, next) => {
    if (req.body.issueTitle === undefined || req.body.issueDesc === undefined || req.body.issueStatus === undefined) {
        res.status(404).json({
            success: false,
            error: 'one or more required fields missing'
        });
    }
    const newIssue = new Issue({
        _id: new mongoose.Types.ObjectId(),
        issueTitle: req.body.issueTitle,
        issueDesc: req.body.issueDesc,
        issueStatus: req.body.issueStatus,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: req.userId,
        modifiedBy: req.userId
    });
    newIssue
        .save()
        .then(result => {
            console.log(`Issue with id ${result._id} added by user with id ${result.createdBy}`);
            res.status(200).json({
                success: true,
                message: "Issue Added",
                newIssue: result
            });
        })
        .catch(err => {
            console.log(`Error in creating issue: ${err}`);
            res.status(500).json({
                success: false,
                error: err
            });
        });
};

exports.updateIssue = (req, res, next) => {
    const issueId = req.params.id;
    if (req.body.issueTitle === undefined || req.body.issueDesc === undefined || req.body.issueStatus === undefined) {
        res.status(404).json({
            success: false,
            error: 'one or more required fields missing'
        });
    }
    const a = await Issue.findById(issueId);
    const updatedIssue = {
        _id: issueId,
        issueTitle: req.body.issueTitle,
        issueDesc: req.body.issueDesc,
        issueStatus: req.body.issueStatus,
        createdAt: a.createdAt,
        updatedAt: Date.now(),
        createdBy: a.createdBy,
        updatedBy: req.userId
    }
    Issue.findByIdAndUpdate(issueId, { $set: updatedIssue })
        /* .cache({ expire: 30 }) */
        .exec()
        .then(result => {
            console.log(`issue with id ${issueId} update successful.`);
            res.status(200).json({
                success: true,
                message: result
            });
        })
        .catch(err => {
            console.log(`Error in updating issue`);
            res.status(400).json({
                success: false,
                error: err
            });
        });
};

exports.deleteIssue = (req, res, next) => {
    const issueId = req.params.id;
    if (req.body.issueTitle === undefined || req.body.issueDesc === undefined || req.body.issueStatus === undefined) {
        res.status(404).json({
            success: false,
            error: 'one or more required fields missing'
        });
    }
    Issue.deleteOne({ _id: issueId })
        /*         .cache({expire:30})    */
        .exec()
        .then(result => {
            console.log(`issue with id ${issueId} deleted successfully.`);
            res.status(200).json({
                success: true,
                message: result
            });
        })
        .catch(err => {
            console.log(`Error in deleting issue`);
            res.status(400).json({
                success: false,
                error: err
            });
        });
}

// get all issues
exports.getAllIssues = (req, res, next) => {
    Issue.find()
        .populate({ path: 'createdBy', select: 'username -_id', })
        .populate({ path: 'updatedBy', select: 'username -_id', })
        // .cache({ expiry: 30 })
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                message: docs
            });
        })
        .catch(err => {
            console.error(`Get Issues Error: ${err}`);
            res.status(400).json({
                success: false,
                error: err
            });
        });
};

// get issue by id
exports.getIssueById = (req, res, next) => {
    Issue.findById(req.params.id)
        .populate({ path: 'createdBy', select: 'username -_id', })
        .populate({ path: 'updatedBy', select: 'username -_id', })
        // .cache({ expiry: 10 })
        .exec()
        .then(issue => {
            if (!issue) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Issue not found' 
                });
            }
            res.status(200).json({
                success: true,
                message: issue
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: err
            });
        });
};

// get issue by query params
exports.getIssueByQueryParams = (req, res, next) => {
    const status = req.query.status;
    const createdBy = req.query.createdBy;
    let chosenParamKey;
    let chosenParamValue;
    if (req.query.status === undefined) {
        chosenParamKey = createdBy;
        chosenParamValue = req.query.createdBy;
    } else {
        chosenParamKey = status;
        chosenParamValue = req.query.status;
    }
    Issue.find({ chosenParamKey: chosenParamValue })
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                issues: docs
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
