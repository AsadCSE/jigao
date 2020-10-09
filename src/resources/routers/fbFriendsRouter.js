const express = require('express')
const User = require('../models/UserModel')
const fetch = require('node-fetch')

const FBFriendsRouter = new express.Router()

FBFriendsRouter.post('/', async (req, res) => {
    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me/friends?access_token=${req.body.token}`)).json()
    
    let ids = fbdata.data.map(e => {
        return e.id
    })

    const fbFriendsData = await User.find({
        fbId: ids
    })
    
    const filteredData = fbFriendsData.map(e => {
        return data = {
            fbId: e.fbId,
            name: e.name,
            avatar: e.avatar
        }
    })
    res.send(JSON.stringify(filteredData))
})

module.exports = FBFriendsRouter