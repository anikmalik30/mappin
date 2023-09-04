const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    // Generate a new password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user instance with hashed password
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user and send a response with the user's ID
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json(err); // Handle any errors and respond with a 500 status code
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  try {
    // Find the user by their username
    const user = await User.findOne({ username: req.body.username });

    // If the user is not found, respond with an error
    !user && res.status(400).json("Wrong username or password!");

    // Validate the provided password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If the password is not valid, respond with an error
    !validPassword && res.status(400).json("Wrong username or password!");

    // Respond with the user's ID and username
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    res.status(500).json(err); // Handle any errors and respond with a 500 status code
  }
});

module.exports = router;
