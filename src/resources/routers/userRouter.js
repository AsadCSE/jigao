const express = require('express')
const fetch = require('node-fetch')
const User = require('../models/UserModel')

const userRouter = new express.Router()

userRouter.post('/:id', async (req, res) => {

    const tokenData = await (await fetch(`https://graph.facebook.com/v2.8/me?access_token=${req.body.token}`)).json()

    const findUser = await User.findOne({fbId: req.params.id})

    try{
        if(findUser.fbId){
            if(tokenData.id === req.params.id){
                const privateUser = findUser.toObject()
                delete privateUser.token
                return res.send(JSON.stringify(privateUser))
            }else{
                const publicUser = findUser.toObject()
                delete publicUser.token
                delete publicUser.following
                return res.send(JSON.stringify(publicUser))
            }
        }
    }catch(e){
        return res.status(501).send()
    }

    res.status(401).send()
})

module.exports = userRouter