const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fbId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    avatar: {
        type: String
    },
    token: {
        type: String
    },
    following: [String],
    followedBy: [String]
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel