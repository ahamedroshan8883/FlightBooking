const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const DBconnection = require('./util/db');
const FBRouter = require('./Routers/Fligthrouters'); 
const UserRouter = require('./Routers/UserRouter');
const BookingRouters = require('./Routers/BookingRouters');
const {
  searchFlight,
  BookingFlight,
  getTicketByuser,
  deleteTicketByUser,
  updateBookingById
} = require('./Controllers/BookingController');
const { signup, signin, jstcheck } = require('./Controllers/UserControl');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api', UserRouter);
app.use('/api', FBRouter);
app.use('/api', BookingRouters);

const start = async () => {
  try {
    await DBconnection(process.env.MONGODB_ATLAS_URL);
    server.listen(8000, () => {
      console.log('The server is running on port 8000');
    });
  } catch (error) {
    console.log(error);
  }
};

start();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // User event listeners
  socket.on('signup', (data, callback) => {
    signup(data, (err, response) => {
      if (err) {
        callback({ status: 'error', error: err.message });
      } else {
        callback({ status: 'success', data: response });
      }
    });
  });

  socket.on('signin', (data, callback) => {
    signin(data, (err, token) => {
      if (err) {
        callback({ status: 'error', error: err.message });
      } else {
        callback({ status: 'success', data: token });
      }
    });
  });

  socket.on('jstcheck', (data, callback) => {
    jstcheck(data, (err, user) => {
      if (err) {
        callback({ status: 'error', error: err.message });
      } else {
        callback({ status: 'success', data: user });
      }
    });
  });

  // Booking event listeners
  socket.on('searchFlight', async (data, callback) => {
    try {
      const result = await searchFlight(data);
      callback({ status: 'success', data: result });
    } catch (error) {
      callback({ status: 'error', error: error.message });
    }
  });

  socket.on('bookFlight', async (data, callback) => {
    try {
      const result = await BookingFlight(data);
      callback({ status: 'success', data: result });
    } catch (error) {
      callback({ status: 'error', error: error.message });
    }
  });

  socket.on('getTickets', async (data, callback) => {
    try {
      const result = await getTicketByuser(data);
      callback({ status: 'success', data: result });
    } catch (error) {
      callback({ status: 'error', error: error.message });
    }
  });

  socket.on('deleteTicket', async (data, callback) => {
    try {
      const result = await deleteTicketByUser(data);
      callback({ status: 'success', data: result });
    } catch (error) {
      callback({ status: 'error', error: error.message });
    }
  });

  socket.on('updateBooking', async (data, callback) => {
    try {
      const result = await updateBookingById(data);
      callback({ status: 'success', data: result });
    } catch (error) {
      callback({ status: 'error', error: error.message });
    }
  });
});
