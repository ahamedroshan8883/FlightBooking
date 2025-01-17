const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true,enum:["admin","user"]},
    mobileno:{type:String,required:true}
})

module.exports = mongoose.model('User',UserSchema);