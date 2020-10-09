const express = require('express')
const fetch = require('node-fetch')
const Question = require('../models/QuestionModel')

const RequestRouter = new express.Router()

RequestRouter.post('/', async (req, res) => {
    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    const limit = 10
    const skip = req.query.skip
    if(req.body.fbId === fbdata.id){
        const questions = await Question.aggregate([
            {
                $lookup:{
                    from: 'users',
                    localField: 'askedBy',
                    foreignField: 'fbId',
                    as: 'user'
                }
            },
            { 
                $match: { 'askedTo': req.body.fbId , answered: false } 
            }
        ]).skip(limit*skip).limit(limit).sort('-createdAt')
        const filteredResponse = questions.map(q => {
            return data ={
                _id: q._id,
                question: q.question,
                name: q.askedAs ? 'Anonymous' : q.user[0].name,
                avatar: q.askedAs ? null : q.user[0].avatar,
                isPrivate: q.isPrivate,
                createdAt: q.createdAt
            }
        })
        return res.send(JSON.stringify(filteredResponse))
    }
    res.status(401).send()
})

module.exports = RequestRouter