const express = require('express')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Question = require('../models/QuestionModel')

const OneRouter = new express.Router()

OneRouter.get('/:id', async (req, res) => {
    try{
        const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.headers.token}`)).json()
        let question = await Question.aggregate([
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
                $lookup:{
                    from: 'users',
                    localField: 'askedTo',
                    foreignField: 'fbId',
                    as: 'askee'
                }
            },
            { 
                $match: { '_id': mongoose.Types.ObjectId(req.params.id) } 
            }
        ])
        question = question[0]
        
        if(fbdata.id === question.askedTo){
            const data = {
                _id: question._id,

                question: question.question,
                createdAt: question.createdAt,

                isPrivate: question.isPrivate,
                isPrivated: question.isPrivated,

                answered: question.answered,
                answer: question.answered ? question.answer.text : null,
                answeredAt: question.answered ? question.answer.time : null,

                askedToName: question.askee[0].name,
                askedToId: question.askee[0].fbId,
                askedToAvatar: question.askee[0].avatar,

                askedByName: question.askedAs ? null : question.asker[0].name,
                askedById: question.askedAs ? null : question.asker[0].fbId,
                askedByAvatar: question.askedAs ? null : question.asker[0].avatar,

                likes: question.likes,
                comments: question.comments
            }
            return res.send(JSON.stringify(data))

        }else if(fbdata.id === question.askedBy){
            const data = {
                _id: question._id,

                question: question.question,
                createdAt: question.createdAt,
                
                isPrivate: question.isPrivate,
                isPrivated: question.isPrivated,

                answered: question.answered,
                answer: question.answered ? question.answer.text : null,
                answeredAt: question.answered ? question.answer.time : null,

                askedToName: question.askee[0].name,
                askedToId: question.askee[0].fbId,
                askedToAvatar: question.askee[0].avatar,

                askedByName: question.asker[0].name,
                askedById: question.asker[0].fbId,
                askedByAvatar: question.asker[0].avatar,

                likes: question.likes,
                comments: question.comments
            }
            return res.send(JSON.stringify(data))

        }else if(question.answered && !question.isPrivate && !question.isPrivated && !question.isHidden){
            const data = {
                _id: question._id,

                question: question.question,
                createdAt: question.createdAt,

                isPrivate: question.isPrivate,
                isPrivated: question.isPrivated,

                answered: question.answered,
                answer: question.answered ? question.answer.text : null,
                answeredAt: question.answered ? question.answer.time : null,

                askedToName: question.askee[0].name,
                askedToId: question.askee[0].fbId,
                askedToAvatar: question.askee[0].avatar,

                askedByName: question.askedAs ? null : question.asker[0].name,
                askedById: question.askedAs ? null : question.asker[0].fbId,
                askedByAvatar: question.askedAs ? null : question.asker[0].avatar,

                likes: question.likes,
                comments: question.comments
            }
            return res.send(JSON.stringify(data))
        }
        res.status(401).send()
    }catch(e){
        res.status(401).send()
    }
})

OneRouter.post('/:id', async (req, res) => {
    const getQuestion = await Question.findById(req.params.id)
    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    if(getQuestion.askedTo === fbdata.id){
        const feedback = await Question.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(req.params.id)
        }, {
            answer: {
                text: req.body.answer ? req.body.answer: '' ,
                time: req.body.answer ? new Date(Date.now()).toISOString() : null
            },
            answered: req.body.answer ? true : false,
            isPrivated: req.body.isPrivated ? true : false
        }, {new:true})
        if(feedback){
            return res.send(JSON.stringify({Message: 'success'}))
        }
        return res.status(401).send()
    }
    res.status(401).send()
})

OneRouter.post('/delete/:id', async (req, res) => {
    try{
        const getQuestion = await Question.findById(req.params.id)
        const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
        if(getQuestion.askedTo === fbdata.id){
            const feedback = await Question.findOneAndDelete({_id: mongoose.Types.ObjectId(req.params.id)})
            if(feedback){
                return res.send(JSON.stringify({Message: 'success'}))
            }
            return res.status(401).send()
        }
        res.status(401).send()
    }catch(e){
        res.status(401).send()
    }
})

module.exports = OneRouter