module.exports = (name) => {
    const {firstname,lastname} = name

    if(firstname === undefined || firstname.includes(' ')){
        return false
    }else if(lastname !== undefined && lastname.length > 20){
        return false
    }else{
        return true
    }
}