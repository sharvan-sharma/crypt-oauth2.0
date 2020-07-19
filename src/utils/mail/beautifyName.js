function CapitalizeFirstLetter(str){
    return str.substring(0,1).toUpperCase()+str.substring(1).toLowerCase()
}

function beautifyName(name){
    return CapitalizeFirstLetter(name.firstname)+' '+CapitalizeFirstLetter(name.lastname)       
}

module.exports = beautifyName