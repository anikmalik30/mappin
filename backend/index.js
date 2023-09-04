const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

dotenv.config(); // Load environment variables from a .env file if present

app.use(express.json()); // Parse incoming JSON data

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  })
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

// Define routes for pins and users
app.use("/api/pins", pinRoute); // Handle routes for pins at /api/pins
app.use("/api/users", userRoute); // Handle routes for users at /api/users

// Start the Express server on port 8800
app.listen(8800, () => {
  console.log("Backend server is running on port 8800!");
});
