const mongoose = require("mongoose"),
      Schema = mongoose.Schema;


   const   userSchema = new Schema({
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        name:{type:String, required:true},
        rank:{type:String, required:false, 'default': 'user'},
        createdOn:{ type: Date, 'default': Date.now }
        
      });


   module.exports = mongoose.model("User", userSchema);



