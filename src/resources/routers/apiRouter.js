const express = require('express')
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const askRouter = require('./askRouter')
const questionRouter = require('./questionRouter')
const FollowRouter = require('./followRouter')
const FBFriendsRouter = require('./fbFriendsRouter')
const HomePostsRouter = require('./homePostsRouter')
const SearchRouter = require('./searchRouter')

const apiRouter = new express.Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/user' , userRouter)
apiRouter.use('/ask', askRouter)
apiRouter.use('/questions', questionRouter)
apiRouter.use('/follow', FollowRouter)
apiRouter.use('/fbfriends', FBFriendsRouter)
apiRouter.use('/homeposts', HomePostsRouter)
apiRouter.use('/search', SearchRouter)

module.exports = apiRouter