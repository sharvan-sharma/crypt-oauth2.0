
const charArr = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
  'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

module.exports = ()=>{

    let str = ''

    for(let i = 0;i < 24;i++){
        const index = Math.floor(Math.random() * 62); 
        str = str + charArr[index]
    }

    return str

}