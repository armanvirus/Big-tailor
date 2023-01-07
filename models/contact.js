const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const contact = new Schema({
    subject:{type:String},
    message:{type:String},
    userEmail:{type:String}
})


module.exports = mongoose.model("contact", contact);