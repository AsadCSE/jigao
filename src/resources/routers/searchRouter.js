const express = require('express')
const fetch = require('node-fetch')
const User = require('../models/UserModel')

const searchRouter = new express.Router()

searchRouter.post('/', async (req, res) => {

    const users = await User.find({name: { $regex: req.body.search , $options: 'i'}}).limit(7)
    const sendUser = users.map(user => {
        return data = {
            name: user.name,
            fbId: user.fbId,
            avatar: user.avatar
        }
    })

    res.send(JSON.stringify(sendUser))
})

module.exports = searchRouter