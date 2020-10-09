const express = require('express')
const homePostsRouter = new express.Router()
const fetch = require('node-fetch')
const Question = require('../models/QuestionModel')
const User = require('../models/UserModel')

homePostsRouter.post('/', async (req, res) => {
    const limit = 10
    const skip = req.query.skip

    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    const user = await User.findOne({fbId: fbdata.id})
    const followList = user.following

    const questions = await Question.aggregate([
        {
            $lookup:{
                from: 'users',
                localField: 'askedBy',
                foreignField: 'fbId',
                as: 'asker'
            }
        },
        {
            $lookup:{
                from: 'users',
                localField: 'askedTo',
                foreignField: 'fbId',
                as: 'askee'
            }
        },
        { 
            $match: { askedTo: { $in: followList }, answered: true, isPrivated: false, isPrivate: false } 
        }
    ]).sort({'answer.time' : -1}).skip(limit*skip).limit(limit)

    const sendData = questions.map(q => {
        return data = {
            _id: q._id,
            askedToName: q.askee[0].name,
            askedToAvatar: q.askee[0].avatar,
            askedByName: q.askedAs ? null : q.asker[0].name,
            askedByAvatar: q.askedAs ? null : q.asker[0].avatar,
            question: q.question,
            likes: q.likes.length,
            comments: q.comments.length,
            answeredAt: q.answer.time
        }
    })

    res.send(JSON.stringify(sendData))
})

module.exports = homePostsRouter