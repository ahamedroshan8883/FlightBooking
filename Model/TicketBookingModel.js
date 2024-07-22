const mongoose = require('mongoose');

const TicketModel = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    username:{
        type:String,required:true
    },
    mobileno:{
        type:Number,required:true
    },
    email:{
        type:String,required:true
    },
    adult_passengers:[{
        name:{type:String,required:true},
        age:{type:Number,requires:true},
        bloodgroup:{type:String,required:true}
    }],
    children_passengers:[{
        name:{type:String,required:false},
        age:{type:Number,requires:false},
        bloodgroup:{type:String,required:false}
    }],
    sheetnumber:[{type:String,required:true}],
    flight:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'flight'
        },
    depaturedate:{type:Date,required:true,min:Date.now(),max:"2024-10-01"},
    adults:{type:Number,required:true},
    children:{type:Number,required:false},
    price:{type:Number,required:true},
    payment:{type:String,required:false,enum:['done','not done']}
})
module.exports = mongoose.model('TicketBooking',TicketModel);