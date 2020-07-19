const mongoose = require('mongoose')

const databaseUrl = (process.env.DB_ENV == 'production') ? process.env.PROD_MONGO : process.env.DEV_MONGO

mongoose.connect(databaseUrl,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    poolSize:10
})

module.exports = mongoose.connection