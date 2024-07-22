const express = require('express');
const { AddFlightDetails, getFlightDetails, UpdateFlightDetails, deleteFlightDetails } = require('../Controllers/FlightControllers');
const FlightRouter = express.Router();

FlightRouter.post('/insert-flight/:email',AddFlightDetails);
FlightRouter.get('/flight/:email/:_id',getFlightDetails);
FlightRouter.post('/updateflight/:email/:_id',UpdateFlightDetails);
FlightRouter.delete('/deleteflight/:email/:_id',deleteFlightDetails);

module.exports = FlightRouter;