const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");

const path = require("path");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect DB
connectDB();

// Route files
// const bootcamps = require("./routes/bootcamps");
// const courses = require("./routes/courses");
// const auth = require("./routes/auth");

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
// app.use(fileupload());

// // Set static folders
// app.use('/uploads', express.static(__dirname + '/public'));

// // Mount the routers
// app.use("/api/v1/bootcamps", bootcamps);
// app.use("/api/v1/courses", courses);
// app.use("/api/v1/auth", auth);

// Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 9000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode in ${process.env.PORT}`
      .bgMagenta
  )
);

process.on("unhandledRejection", (err, promise) => {
  // Handle unhandled promise rejection
  console.log(`Error: ${err.message}`.red.bold);
  // close and exit the server
  server.close(() => process.exit(1));
});
