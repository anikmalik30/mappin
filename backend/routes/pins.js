const router = require("express").Router();
const Pin = require("../models/Pin");

// Create a new Pin
router.post("/", async (req, res) => {
  // Create a new Pin instance with data from the request body
  const newPin = new Pin(req.body);

  try {
    // Save the new Pin to the database
    const savedPin = await newPin.save();
    res.status(200).json(savedPin); // Respond with the saved Pin data
  } catch (err) {
    res.status(500).json(err); // Handle any errors and respond with a 500 status code
  }
});

// Get all Pins
router.get("/", async (req, res) => {
  try {
    // Retrieve all Pins from the database
    const pins = await Pin.find();
    res.status(200).json(pins); // Respond with the list of Pins
  } catch (err) {
    res.status(500).json(err); // Handle any errors and respond with a 500 status code
  }
});

module.exports = router;
