const mongoose = require("mongoose");

const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const checkAuth = require('../middleware/authUser');

// add new issue
exports.addIssue = (req, res, next) => {
    if (checkAuth) {
        if (req.body.issueTitle === undefined || req.body.issueDesc === undefined || req.body.issueStatus === undefined) {
            res.status(404).json({
                success: false,
                message: 'one or more required fields missing'
            });
        }
        const newIssue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            issueTitle: req.body.issueTitle,
            issueDesc: req.body.issueDesc,
            issueStatus: req.body.issueStatus,
            createdBy: req.userId,
            modifiedBy: req.userId
        });
        newIssue
            .save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: "Issue Added"
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};

exports.updateIssue = (req, res, next) => {
    if (checkAuth) {
        const issueId = req.params.id;
        if (req.body.issueTitle === undefined || req.body.issueDesc === undefined || req.body.issueStatus === undefined) {
            res.status(404).json({
                success: false,
                message: 'one or more required fields missing'
            });
        }
        Issue.updateOne({ _id: issueId }, { $set: req.body })
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
                    message: err
                });
            });
    }
};

exports.deleteIssue = (req, res, next) => {
    if (checkAuth) {
        const issueId = req.params.id;
        if (req.body.issueTitle === undefined || req.body.issueDesc === undefined || req.body.issueStatus === undefined) {
            res.status(404).json({
                success: false,
                message: 'one or more required fields missing'
            });
        }
        Issue.deleteOne({ _id: issueId })
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
                    message: err
                });
            });
    }
}

// get all issues
exports.getAllIssues = (req, res, next) => {
    Issue.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                issues: docs
            });
        })
        .catch(err => {
            console.error(`Get Issues Error: ${err}`);
            res.status(400).json({
                success: false,
                message: err
            });
        });
};

// get issue by id
exports.getIssueById = (req, res, next) => {
    Issue.findById(req.params.id)
        .exec()
        .then(issue => {
            if (!issue) {
                return res.status(404).json({ message: 'Issue not found' });
            }
            res.status(200).json({
                success: true,
                issues: issue
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

// get issue by status
exports.getIssueByStatus = (req, res, next) => {
    Issue.find({ issueStatus: req.params.issueStatus })
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




