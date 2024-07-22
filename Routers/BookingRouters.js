const express = require('express');
const { searchFlight, BookingFlight, getTicketByuser, deleteTicketByUser, updateBookingById } = require('../Controllers/BookingController');
const authMiddleware = require('../Middleware/authMiddleware');
const BookingRouters = express.Router();

BookingRouters.get('/searchflights/:email',searchFlight);
BookingRouters.post('/BookingTravel/:email/:_id',BookingFlight);
BookingRouters.get('/gettickets',authMiddleware,getTicketByuser);
BookingRouters.delete('/cancelticket/:_id',authMiddleware,deleteTicketByUser);
BookingRouters.put('/updateTicket/:email/:_id',updateBookingById)

module.exports = BookingRouters;