module.exports = (str) => {

  var regexp = new RegExp("^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$");
       
 if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}

 