const CustomAPIError = require("../ErrorHandler/CustomAPIError");
const FlightsModel = require("../Model/FlightsModel");
const TicketBookingModel = require("../Model/TicketBookingModel");
const UserModel = require("../Model/UserModel");
const PDFDocument = require('pdfkit');
const emailjs = require("emailjs");
const fs = require('fs');
const path = require('path');

const searchFlight = async(req,res,next)=>{
    const user = await UserModel.findOne({email:req.params.email});
    try{
        if(!user || user.role !== 'user'){
            return next(new CustomAPIError('No user found'),400);
        }
        console.log(req.body);

        const flights = await FlightsModel.find({originCity:req.body.origin,destinationCity:req.body.destination});
        if (!flights || flights.length === 0) {
            return next(new CustomAPIError('No flights found', 404));
        }

        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        const formattedDepatureDate = formatDate(req.body.depatureDate);

        const matchingFlights = flights.filter(flight =>
            flight.date.some(date => formatDate(date) === formattedDepatureDate)
        );
        if (matchingFlights.length === 0) {
            return next(new CustomAPIError('No flights found for the given departure date', 404));
        }
        res.status(302).json(matchingFlights);
    }catch(error){
        return next(new CustomAPIError(error),404);
    }
}


const BookingFlight = async (req, res, next) => {
  const details = req.body;
  try {
    let user = await UserModel.findOne({ email: req.params.email });
    let flight = await FlightsModel.findById(req.params._id);

    if (!user) {
      return next(new CustomAPIError('No user found', 404));
    }

    if (!flight) {
      return next(new CustomAPIError('No flights', 404));
    }

    if (details.adult_passengers.length !== details.adults) {
      return next(new CustomAPIError('Adults details are missing', 404));
    }

    if (details.children_passengers.length !== details.children) {
      return next(new CustomAPIError('Children details are missing', 404));
    }

    if (details.sheetnumber.length !== (details.children + details.adults)) {
      return next(new CustomAPIError('Certain details were missing', 404));
    }

    if (flight.available_sheets <= 0 && flight.booked_sheets === flight.total_sheets) {
      return next(new CustomAPIError('No sheets available', 404));
    }

    const booking = { ...details };
    booking.username = user.username;
    booking.email = user.email;
    booking.mobileno = user.mobileno;
    booking.user = user._id;
    booking.flight = flight._id;
    let adultsticket_price = details.adults * flight.fare;
    let childrenticket_price = details.children * (flight.fare / 2);
    booking.price = Number((adultsticket_price + childrenticket_price) - ((adultsticket_price + childrenticket_price) / 100 * flight.discount));

    const updatedBookedSheets = flight.booked_sheets + details.adults + details.children;
    const updatedAvailableSheets = flight.available_sheets - details.adults - details.children;
    const updatedSheetNumbers = flight.available_sheetnumbers.filter(sheet => 
      !details.sheetnumber.includes(sheet)
    );

    const sheetsReduced = await FlightsModel.findByIdAndUpdate(
      req.params._id,
      {
        booked_sheets: updatedBookedSheets,
        available_sheets: updatedAvailableSheets,
        available_sheetnumbers: updatedSheetNumbers,
        booked_sheetnumbers: [...flight.booked_sheetnumbers, ...details.sheetnumber]
      },
      { new: true }
    );

    booking.flight = sheetsReduced;

    const createdBooking = await TicketBookingModel.create(booking);
    if (createdBooking) {
      const pdfPath = path.join(__dirname, `confirmation${createdBooking._id}.pdf`);
      try {
        await generatePDF(booking, pdfPath);
        await sendEmail(user.email, pdfPath);
        res.status(201).json(createdBooking);
      } catch (error) {
        return next(new CustomAPIError(error, 500));
      }
    } else {
      res.status(400).send("Unable to book ticket");
    }
  } catch (error) {
    next(new CustomAPIError(error.message, 500));
  }
};
  const getTicketByuser = async(req,res,next)=>{
    try{
      console.log(req.body);
      const user = await UserModel.findOne({email:req.body.email});
      const tickets = await TicketBookingModel.find({user:user._id});
      console.log(tickets.length);
      if(tickets.length>0){
        res.status(200).json(tickets);
      }else{
        next(new CustomAPIError('no tickets available'),500);
      }
    }catch(error){
      next(new CustomAPIError(error),500);
    }
  }
  const deleteTicketByUser = async(req,res,next)=>{
    try{
      const user = await UserModel.findOne({email:req.body.email});

      if(user){
        const deletedTicket = await TicketBookingModel.findByIdAndDelete(req.params._id);
        if(deletedTicket){
          const flight = await FlightsModel.findById(deletedTicket.flight)
          // res.status(200).send('Ticket cancelled');
          const updatedavailableSheetnumbers = [...flight.available_sheetnumbers, ...deletedTicket.sheetnumber]
          const updatedBookedSheetnumbers = flight.booked_sheetnumbers.filter(sheet => 
            !deletedTicket.sheetnumber.includes(sheet)
          );
          const updatedavailablesheets = flight.available_sheets+deletedTicket.adults+deletedTicket.children;
        const updatedBookedSheets = flight.booked_sheets-(deletedTicket.adults+deletedTicket.children);
        // console.log(updatedavailableSheetnumbers+" "+updatedBookedSheetnumbers.length);
        // console.log(updatedavailablesheets+" "+updatedBookedSheets);
        // console.log(flight.available_sheets+" "+flight.booked_sheets);
        const updatedflight = await FlightsModel.findByIdAndUpdate(deletedTicket.flight,{available_sheets:updatedavailablesheets,
          booked_sheets:updatedBookedSheets,available_sheetnumbers:updatedavailableSheetnumbers,booked_sheetnumbers:updatedBookedSheetnumbers},{new:true})
          console.log(updatedflight);
            if(deletedTicket){
              res.status(200).send('Ticket cancelled');
            }
        }else{
          return next(new CustomAPIError('no ticket founded'),404);
        }
      }else{
        next(new CustomAPIError('user not found'),404);
      }
    }catch(error){
      next(new CustomAPIError(error),500);
    }
  }
  const updateBookingById = async(req,res,next)=>{
    try {
      const user = await UserModel.findOne({ email: req.params.email });
      if (user.role !== "user") {
        return next(new CustomAPIError("User not found", 404));
      }
      
      const ticket = await TicketBookingModel.findById(req.params._id);
      if (!ticket) {
        return next(new CustomAPIError("Ticket not found", 404));
      }
    
      const flight = await FlightsModel.findById(ticket.flight);
      if (!flight) {
        return next(new CustomAPIError("Flight not found", 404));
      }
    
      // Update adult passengers
      if (req.body.adult_passengers) {
        if (req.body.adult_passengers.length < ticket.adults) {
          return next(new CustomAPIError("Adult details are missing", 404));
        } else {
          ticket.adult_passengers = req.body.adult_passengers;
        }
      }
    
      // Update children passengers
      if (req.body.children_passengers) {
        if (req.body.children_passengers.length < ticket.children) {
          return next(new CustomAPIError("Children details are missing", 404));
        } else {
          ticket.children_passengers = req.body.children_passengers;
        }
      }
    
      // Update sheet numbers
      if (req.body.sheetnumber) {
        const totalPassengers = ticket.adult_passengers.length + ticket.children_passengers.length;
        if (req.body.sheetnumber.length !== totalPassengers) {
          return next(new CustomAPIError("Passenger details are uneven with passenger details", 500));
        } else {
          let updatedAvailableSheetnumbers = [...flight.available_sheetnumbers,...ticket.sheetnumber].filter(sheet=>!req.body.sheetnumber.includes(sheet));
          const filteredBookedSheets = flight.booked_sheetnumbers.filter(sheet => 
            !ticket.sheetnumber.includes(sheet)
          );
          
          // Combine the filtered booked sheets with the new sheets and remove duplicates using a Set
          const updatedBookedSheetnumbers = [...new Set([...filteredBookedSheets, ...req.body.sheetnumber])];
          
          console.log(updatedAvailableSheetnumbers.length);
          console.log(updatedBookedSheetnumbers.length);
          flight.available_sheetnumbers = updatedAvailableSheetnumbers;
          flight.booked_sheetnumbers = updatedBookedSheetnumbers;
          ticket.sheetnumber = req.body.sheetnumber;
    
          await flight.save();
        }
      }
    
      // Save the updated ticket
      const updatedTicket = await ticket.save();
      res.status(200).json({ success: true, data: updatedTicket });
    
    } catch (error) {
      next(new CustomAPIError(error.message, 500));
    }
  } 
module.exports = {searchFlight,BookingFlight,getTicketByuser,deleteTicketByUser,updateBookingById};

emailjs.init('wm7lvPouZwU48GNT-');

const nodemailer = require('nodemailer');
const fs = require('fs');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});

// Function to send email with attachment
const sendEmail = async (recipient, pdfPath) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: 'Flight Booking Confirmation',
      text: 'Please find your booking confirmation attached.',
      attachments: [
        {
          filename: 'confirmation.pdf',
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};
