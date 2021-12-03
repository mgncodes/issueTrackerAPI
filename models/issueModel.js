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
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	modifiedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});
module.exports = mongoose.model('Issue', issueSchema);