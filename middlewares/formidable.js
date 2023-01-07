const path = require('path');

module.exports = function(formidable){
      /*formidable */
 formidable({
  encoding:"utf-8",
multiples:true,
keepExtensions:true,
 dest: path.join(__dirname, 'public/upload/')}
)
 }