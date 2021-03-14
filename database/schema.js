const mongoose = require('mongoose');

// define schema
const userSchema = mongoose.Schema({
    _id: String, // Discord user ID
    username: String, // Discord username
});

// export model
module.exports = mongoose.model('User', userSchema);