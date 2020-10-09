const express = require('express')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Question = require('../models/QuestionModel')

const CommentRouter = new express.Router()

CommentRouter.post('/:id', async (req, res) => {
    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    const updateComment = await Question.findOneAndUpdate({_id: req.params.id, answered: true}, {
        $push: {comments: { 
            fbId: fbdata.id, 
            comment: req.body.comment, 
            time: new Date(Date.now()).toISOString(),
            name: req.body.name,
            avatar: req.body.avatar
        }}
    }, {new: true})
    if(updateComment._id){
        res.send({message: req.body.comment})
    }else{
        res.status(401).send()
    }
})

module.exports = CommentRouter