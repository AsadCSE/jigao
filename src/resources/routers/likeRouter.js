const express = require('express')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Question = require('../models/QuestionModel')

const LikeRouter = new express.Router()

LikeRouter.post('/:id', async (req, res) => {
    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    const checkLiked = await Question.findOne({_id: req.params.id})
    if(checkLiked.likes.includes(fbdata.id)){
        return res.send({Message: 'success'})
    }else{
        const like = await Question.findOneAndUpdate({_id: req.params.id}, {
            $push: {likes: fbdata.id}
        }, {new: true})
        if(like.likes.includes(fbdata.id)){
            return res.send({Message: 'success'})
        }
        res.status(401).send()
    }
})

module.exports = LikeRouter