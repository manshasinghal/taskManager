const bcrypt = require('bcrypt');
const { User } = require('../db');

async function signup(req, res) {
  const { email, password, deviceDetails, geolocation } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

   
    const newUser = new User({ email, password, deviceDetails,
      geolocation,
      loginTimestamp: Date.now()  });
    await newUser.save();

  
   

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err.message });
  }
}

module.exports = {  
    signup
}