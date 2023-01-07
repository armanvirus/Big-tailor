const mongoose = require("mongoose"),
      path = require('path'),
      Schema = mongoose.Schema;


   const   productSchema = new Schema({
        filename:{type:String, required:true, unique:true},
        name:{type:String, required:true},
        price:{type:Number, required:true, },
        type:{type:String, required:true},
        description:   {type:String, required:true},
        colors:  {type:String, required:true},
        views:{ type: Number, 'default': 0 }, 
        likes:[{type: Schema.Types.ObjectId, ref:"User"}],
        createdOn:{ type: Date, 'default': Date.now }

      });

      productSchema.virtual('uniqueId') 
      .get(function() { 
          return this.filename.replace(path.extname(this.filename), '');    
     });


   module.exports = mongoose.model("Products", productSchema);
