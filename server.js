const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('colors');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// connect DB
connectDB();

// Route files
const user = require('./routes/user');
const post = require('./routes/post');
const community = require('./routes/community');

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
// app.use(fileupload());

// // Set static folders
// app.use('/uploads', express.static(__dirname + '/public'));

// // Mount the routers
app.use('/api/v1/user', user);
app.use('/api/v1/post', post);
app.use('/api/v1/community', community);

// Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 9000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode in ${process.env.PORT}`
      .yellow,
  ),
);

process.on('unhandledRejection', err => {
  // Handle unhandled promise rejection
  console.log(`Error: ${err.message}`.red.bold);
  // close and exit the server
  server.close(() => process.exit(1));
});
