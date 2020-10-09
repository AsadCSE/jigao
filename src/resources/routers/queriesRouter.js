const express = require('express')
const fetch = require('node-fetch')
const Question = require('../models/QuestionModel')


const QueriesRouter = new express.Router()

QueriesRouter.post('/', async (req, res) => {
    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    const limit = 10
    const skip = req.query.skip
    if(req.body.fbId === fbdata.id){
        const questions = await Question.aggregate([
            {
                $lookup:{
                    from: 'users',
                    localField: 'askedTo',
                    foreignField: 'fbId',
                    as: 'user'
                }
            },
            { 
                $match: { 'askedBy': req.body.fbId } 
            }
        ]).skip(limit*skip).limit(limit).sort('-createdAt')
        const filteredResponse = questions.map(q => {
            return data ={
                _id: q._id,
                question: q.question,
                name: q.user[0].name,
                avatar: q.user[0].avatar,
                isPrivate: q.isPrivate,
                createdAt: q.createdAt
            }
        })
        return res.send(JSON.stringify(filteredResponse))
    }
    res.status(401).send()
})

module.exports = QueriesRouter