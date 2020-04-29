const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

const magic = (str)=>{
    const magic = str.substring(0,1).toUpperCase()+str.substring(1).toLowerCase()
    return magic
}

const beautifyname = (name)=>{
     const {firstname,lastname} = name
     const middlename = (name.middlename !== '')?magic(middlename)+' ':''
     const beautifyname = magic(firstname)+' '+middlename+magic(lastname)
     return beautifyname
}


const recoverPwdMail = async (user,token,cb)=>{
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: '"CryPt Support Team" <crypt.oauth.service@gmail.com>',
    to: user.email, 
    subject: "Password Recovery Mail from CryPt Oauth2.0", 
    html: `<b>Hello ${beautifyname(user.name)}</b>
           <p>Click on the link given below to change your account password</p>
           <p><a href=${process.env.FRONT_DOMAIN+'resetpassword?pt='+token}>${process.env.FRONT_DOMAIN+'resetpassword?pt='+token}</a></p>
           <small>This link is going to be invalid after 10 minutes of generation</small>
           <br/>
           <p>Thank you</p>
           <p>CryPt support Team</p>` 
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
 
  cb()
  
}

const passwordReset = (user,cb)=>{
    jwt.sign({username:user.username},process.env.RESET_PWD_SECRET,{expiresIn:10*60},(err,token)=>{
        if(err){
            cb(0)
        }else{
            recoverPwdMail(user,token,()=>{
                cb(1)
            })
        }
    })
}

module.exports = passwordReset