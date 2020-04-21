const mongoose =require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); 

const appSchema = mongoose.Schema({
    appdocID:{type:String}
})

const clientSchema = mongoose.Schema({
    client_id:{type:String}
})

const userSchema = mongoose.Schema({
  username:{type:String,unique:true},//tester1
  password:{type:String},
  email:{type:String,unique:true},
  cryptId:{type:String},//tester1.user-crypt
  name:{type:Object},
  attempts:{type:Number},
  last:{type:String},
  verified:{type:Boolean},
  transaction_id:{type:String},
  status:{type:String},
  apps:[appSchema],
  approved_clients:[clientSchema]
})

const options = {
    maxInterval:60000,
    usernameField:'username',
    attemptsField:'attempts',
    lastLoginField:'last',
    usernameLowerCase:true,
    limitAttempts:true,
    maxAttempts:10,
    usernameQueryFields:['email']
}

userSchema.plugin(passportLocalMongoose,options);

const User = mongoose.model('users',userSchema);

module.exports = User;