const express = require('express');
const appRoot = require('app-root-path');
const userpassport = require(`${appRoot}/appbin/config/userPassport`);
const User = require(`${appRoot}/appbin/config/models/usermodel`);
const winslog = require(`${appRoot}/appbin/config/winston`);

const router = express.Router();

var count = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
        res.json({status:200,msg:'welocome to crypt api server'});
    }else{
        res.json({status:401,msg:'please login'})
    }
});

router.route('/register')
.post((req,res)=>{
    const {username,fullName,password} = req.body
     User.register({ username,fullName}, password, function(err, account) {
        if (err) {
            if(err.name === 'UserExistsError'){
                res.json({msg:err.name,status:401});
            }else{
                res.json({msg:err,status:500});
            }
        }else{
            userpassport.authenticate('local')(req,res,()=>{
                    count++;
                    winslog.log({level:'info',message:req.user.username+" is the new register entry.total users are "+count});
                    res.json({status:200,user:req.user.username});
            })
        }
    });
})



router.route('/login')
.post(userpassport.authenticate('local', { successRedirect: '/loginsuccess',
                                   failureRedirect: '/loginfail' }));

router.route('/loginsuccess')
.get((req,res)=>{
     count++;
     winslog.log({level:'info',message:req.user.username+" is the new login entry.total users are "+count});
     res.json({status:200,user:req.user.username});
})

router.route('/loginfail')
.get((req,res)=>{
    res.json({status:401,user:null})
})


router.route('/forgotpwd')
.post((req,res)=>{
   res.json({status:200,msg:req.body.username+' we will send you link to change passport on the mail provided'})
})

router.route('/logout')
.get((req,res)=>{
    if(req.isAuthenticated()){
        count--;
        winslog.log({level:'info',message:req.user.username+" its getting logout.remaining user"+count});
        req.logout();
        res.json({status:200,user:''});
    }else{
        winslog.log({level:'info',message:'login first to logout'});
        res.json({status:403});
    }
});


module.exports = router;
