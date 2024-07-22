const mongoose = require('mongoose');

const FlightSchema = mongoose.Schema({
    airlines: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      origin: {
        type: String,
        required: true,
      },
      originCity: {
        type: String,
        required: true,
      },
      destination: {
        type: String,
        required: true,
      },
      destinationCity: {
        type: String,
        required: true,
      },
      date: [{
        type: Date,
        required: false,
      }],
      fare: {
        type: Number,
        required: true,
      },
      discount:{
        type:Number,
        required:true
      },
      available_sheets:{
        type:Number,
        required:true
      },
      available_sheetnumbers:[{type:String,required:true}],
      booked_sheets:{
        type:Number,
        required:true
      },
      booked_sheetnumbers:[{type:String,required:true}],
      total_sheets:{
        type:Number,
        required:true
      },
      timming:[{type:String,required:true}]    
        })

module.exports = mongoose.model('Flights',FlightSchema);