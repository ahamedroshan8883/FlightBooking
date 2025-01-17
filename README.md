Flight Booking Application
Description
The Flight Booking Application is a web-based platform that allows users to search for flights, book tickets, and receive booking confirmations via email. The application is built using modern web technologies and provides a seamless user experience for booking flights.

Features
User registration and authentication
Flight search functionality
Ticket booking system
Email confirmation with PDF attachment
Admin panel for managing flights and bookings
Technologies Used
Backend: Node.js, Express.js
Database: MongoDB
Email Service: EmailJS
PDF Generation: PDFKit
Setup and Installation
Prerequisites
Node.js and npm installed
MongoDB instance running
EmailJS account for sending emails
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/ahamedroshan8883/FlightBooking.git
cd FlightBooking
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add the following variables:

env
Copy code
PORT=3000
MONGODB_URI=your_mongodb_connection_string
EMAILJS_USER=your_emailjs_user_id
EMAILJS_SERVICE=your_emailjs_service_id
EMAILJS_TEMPLATE=your_emailjs_template_id
EMAIL=your_email@example.com
PASSWORD=your_email_password
Start the server:

bash
Copy code
npm start
The application will be running at http://localhost:3000.

Usage
Register and log in to the application.
Search for flights by entering the desired criteria.
Select a flight and proceed with the booking process.
Receive a booking confirmation via email with a PDF attachment.
API Endpoints
User Registration: POST /api/users/register
User Login: POST /api/users/login
Flight Search: GET /api/flights/search
Book Flight: POST /api/bookings
Admin - Manage Flights: POST /api/admin/flights
Project Structure
bash
Copy code
FlightBooking/
├── Controllers/
│   ├── BookingController.js
│   ├── FlightController.js
│   └── UserController.js
├── Models/
│   ├── BookingModel.js
│   ├── FlightModel.js
│   └── UserModel.js
├── Routes/
│   ├── bookingRoutes.js
│   ├── flightRoutes.js
│   └── userRoutes.js
├── views/
│   ├── index.html
│   └── ...
├── .env
├── server.js
└── ...
Contributing
Contributions are welcome! Please create a pull request or submit an issue for any changes or improvements.

License
This project is licensed under the MIT License.

Contact
For any inquiries or support, please contact:

Ahamed Roshan Akther H
Email
GitHub
Feel free to modify this template to fit your project's specific details and requirements.








