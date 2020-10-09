const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({

    // ***************************provided by asker******************************

    question: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length <= 10 && value.length > 160){
                throw new Error('Not in range')
            }
        }
    },
    askedBy: {
        type: String,
        required: true
    },
    askedAs: {
        type: Boolean,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    },
    askedTo: {
        type: String,
        required: true
    },

    // ***************************provided by askee******************************

    answered: {
        type: Boolean,
        default: false
    },
    answer: {
        text: {
            type: String,
            trim: true,
            default: ''
        },
        time:{
            type: String
        }
    },
    isPrivated: {
        type: Boolean,
        default: false
    },

    // ***************************provided by any******************************
    
    likes: [String],
    comments: [{
        fbId: {
            type: String
        },
        comment: {
            type: String
        },
        time: {
            type: String
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        }
    }]
},{
    timestamps: true
})

const QuestionModel = mongoose.model('Question', questionSchema)

module.exports = QuestionModel