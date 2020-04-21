function verifyLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            next()
        }else{
            res.redirect('/loginfail')
        }
}

module.exports = verifyLoggedIn