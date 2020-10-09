const express = require('express')
const User = require('../models/UserModel')
const fetch = require('node-fetch')

const authRouter = new express.Router()

authRouter.post('/', async (req, res) => {

    const fbdata = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()
    
    if(req.body.fbId === fbdata.id){
        const longToken = await (await fetch(`https://graph.facebook.com/v2.8/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FBAppID}&client_secret=${process.env.FBAppSecret}&fb_exchange_token=${req.body.token}`)).json()

        const findUser = await User.findOne({fbId: req.body.fbId})

        if(findUser){
            const updatedUser = await User.findOneAndUpdate({ fbId: findUser.fbId }, { token: longToken.access_token }, { new: true } )
            res.send(JSON.stringify(updatedUser))
        }else{
            const user = new User({
                ...req.body,
                token: longToken.access_token
            })
            const newUser = await user.save()
            res.send(JSON.stringify(newUser))
        }
    }else{
        res.send({Error: 'Access Denied'})
    }
})

module.exports = authRouter