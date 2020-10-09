const mongoose = require('mongoose')

try{
    mongoose.connect(process.env.MongodbUrl,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    },(error,result) => {
        if(error){
            return console.log(error)
        }
        console.log('db connection success')
    })
}catch(e){
    console.log('database connection error')
}