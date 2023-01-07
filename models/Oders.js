const mongoose = require("mongoose"),
      Schema = mongoose.Schema;


   const   OderSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    cart:{type:Object,required: true},
    address:{type:String,required: true},
    name:{type: String,required: true},
    tel:{type:String,required: true},
    paymentId:{type:String, required:true},
    date:{ type: Date, 'default': Date.now }

      });


module.exports = mongoose.model('Oder', OderSchema);
