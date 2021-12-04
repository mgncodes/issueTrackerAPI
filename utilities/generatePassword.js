const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

exports.comparePassword = (oldPassword, hashpassword, callback) => {
    bcrypt.compare(oldPassword, hashpassword, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res);
        }
    });
}