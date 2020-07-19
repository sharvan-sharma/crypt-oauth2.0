
module.exports = (req,res,next) => {
    if(req.isAuthenticated()){
        next()
        // res.json({status:200,
        //     logged_in:true,
        //     username:req.user.username,
        //     email:req.user.email,
        //     createdAt:req.user.createdAt,
        //     photo:req.user.photo
        // })
    }else{
        res.json({status:401})
    }
}