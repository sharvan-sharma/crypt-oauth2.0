const passport = require('passport')
const {Users} = require('./models')

passport.serializeUser((user,done)=>{
    console.log('serialise user')
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    Users.findById(id,(err,user)=>{
        console.log('deserialise user')
        if(err) done(err,false)
        else done(null,user)
    })
})

passport.use(Users.createStrategy())

module.exports = passport