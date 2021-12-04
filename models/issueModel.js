const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	issueTitle: {
		type: String,
		required: true
	},
	issueDesc: {
		type: String,
		default: ''
	},
	issueStatus: {
		type: String,
		default: 'open'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	modifiedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});
module.exports = mongoose.model('Issue', issueSchema);