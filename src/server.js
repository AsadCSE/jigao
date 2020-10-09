const express = require('express')
const bodyParser = require('body-parser')
require('./resources/db/mongodb')

const app = express()
const port = process.env.PORT

app.use(express.static('public'))

const apiRouter = require('./resources/routers/apiRouter')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(bodyParser.json())

app.use('/api', apiRouter)

app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})