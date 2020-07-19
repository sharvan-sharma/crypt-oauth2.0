const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose'); 

const userSchema = mongoose.Schema({
  username:{type:String,unique:true},//tester1
  email:{type:String,unique:true},
  cryptId:{type:String,default:null},//tester1.user-crypt
  name:{type:Object},
  attempts:{type:Number},
  last:{type:String},
  verified:{type:Boolean,default:false},
  transaction_id:{type:String},
  createdAt:{type:Date,default:Date.now},
  status:{type:String,default:'IA'},
  photo:{type:String,default:null},
  login_status:{type:String,default:'IA'}
})

const options = {
    maxInterval:60000,
    usernameField:'username',
    attemptsField:'attempts',
    lastLoginField:'last',
    usernameLowerCase:false,
    limitAttempts:true,
    maxAttempts:10,
    usernameQueryFields:['email']
}



userSchema.plugin(passportLocalMongoose,options);

const Users = mongoose.model('users',userSchema);

module.exports = Users;