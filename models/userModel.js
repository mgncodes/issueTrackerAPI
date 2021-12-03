const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        min: 3,
        unique: true,
        required: true
    }, 
    password: {
        type: String, 
        default: '',
        min: 3,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);