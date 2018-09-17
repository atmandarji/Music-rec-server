const mongoose = require('mongoose');
const historySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String,
        required: true,
    },
    artist: { type: String, required: true }
});

historySchema.index({userid: 1, artist: 1}, {unique: true});

module.exports = mongoose.model('History', historySchema);
