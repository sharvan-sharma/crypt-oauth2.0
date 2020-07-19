module.exports = (username) => {
    if(username.includes(' ') || username.length > 20){
        return false
    }else{
        return true
    }
}