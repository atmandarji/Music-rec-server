const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
