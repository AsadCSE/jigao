const express = require('express')

const RequestsRouter = require('./requestsRouter')
const QueriesRouter = require('./queriesRouter')
const ProfileQRouter = require('./profileQRouter')
const OneRouter = require('./oneRouter')
const LikeRouter = require('./likeRouter')
const CommentRouter = require('./commentRouter')
const PrivateRouter = require('./privateRouter')

const QuestionRouter = new express.Router()

QuestionRouter.use('/requests', RequestsRouter)
QuestionRouter.use('/queries', QueriesRouter)
QuestionRouter.use('/profile', ProfileQRouter)
QuestionRouter.use('/one', OneRouter)
QuestionRouter.use('/likes', LikeRouter)
QuestionRouter.use('/comments', CommentRouter)
QuestionRouter.use('/private', PrivateRouter)

module.exports = QuestionRouter