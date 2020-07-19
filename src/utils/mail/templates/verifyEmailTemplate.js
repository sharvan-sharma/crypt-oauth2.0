const beautifyName = require('../index').beautifyName

function verifyEmailTemplate(receiverEmail,reciverName,token){

const template = {
    from: '"CryPt Team" <crypt.oauth.service@gmail.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: "Verification Email from CryPt", // Subject line
    html: `<h3>Hello ${beautifyName(reciverName)}</h3>
    <p>The verification link is given below<p>
    <a href=${process.env.FRONT_DOMAIN+'/verifyemail?token='+token}>${process.env.FRONT_DOMAIN+'/verifyemail?token='+token}<a>
    <br/><small>This verification link is going to expire after 1 hour of Generation</small>
    <p>Regards</p>
    <p><b>C</b>ry<b>P</b>t Team</p>` // html body
}
return template
}

module.exports = verifyEmailTemplate