const express = require('express')
const fetch = require('node-fetch')
const User = require('../models/UserModel')

const FollowRouter = new express.Router()

FollowRouter.post('/:id', async (req, res) => {

    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    
    const profile = await User.findOne({fbId: req.params.id})
    const user = await User.findOne({fbId: fbdata.id})

    if(profile.followedBy.includes(user.fbId)){

        await User.findOneAndUpdate({fbId: profile.fbId}, {
            $pull: {followedBy: user.fbId}
        })
        await User.findOneAndUpdate({fbId: user.fbId}, {
            $pull: {following: profile.fbId}
        })
        

        res.send({message: 'success'})
    }else{

        await User.findOneAndUpdate({fbId: profile.fbId}, {
            $push: {followedBy: user.fbId}
        })

        await User.findOneAndUpdate({fbId: user.fbId}, {
            $push: {following: profile.fbId}
        })

        res.send({message: 'success'})
    }
})

module.exports = FollowRouter