const express = require('express')
const Question = require('../models/QuestionModel')
const User = require('../models/UserModel')
const fetch = require('node-fetch')

const askRouter = new express.Router()

askRouter.post('/', async (req, res) => {

    // console.log(req.body)
    const tokenData = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()

    if((tokenData.id === req.body.askedBy) && (req.body.askedBy !== req.body.askedTo)){
        const findAskee = await User.findOne({fbId: req.body.askedTo})
        if(findAskee._id){
            const questionObject = {
                ...req.body
            }
            delete questionObject.token
            const question = new Question(questionObject)
            const feedback = await question.save()
            if(feedback._id){
                res.send({Success: 'Question submitted!'})
            }else{
                res.send({Error: 'Submission failed'})
            }
        }else{
            res.send({Error: 'No user found'})
        }
    }else{
        res.send({Error: 'Unauthorised Access'})
    }
})

module.exports = askRouter