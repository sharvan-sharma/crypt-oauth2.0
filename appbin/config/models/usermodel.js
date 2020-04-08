const mongoose =require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); 

const appsSchema = mongoose.Schema({
    name:{type:String,required:true},
    clientId:{type:String,required:true,unique:true},
    clientSecret:{type:String,required:true}
})

const userSchema = mongoose.Schema({
  username:{type:String,unique:true,required:true},
  password:{type:String,unique:false,require:false},
  fullName:{type:String,required:true},
  apps:[appsSchema]
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('users',userSchema);

module.exports = User;