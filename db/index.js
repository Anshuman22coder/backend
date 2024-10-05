const mongoose = require("mongoose");

// Single MongoDB connection
const mongoURI = "mongodb+srv://admin:cQYKlyRCbZZX7PBp@anshuman.l4xvw.mongodb.net/NASA2";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Defining User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  age: Number,
  teamName: String
});

// Defining Team schema with members as an array of usernames and a score field
const TeamSchema = new mongoose.Schema({
  teamName: String,
  members: [String],   // Array to store multiple usernames
  score: {             // Adding a score field
    type: Number,
    default: 0         // Initialize with 0 score by default
  }
});

// Creating models for User and Team
const User = mongoose.model('User', UserSchema);
const Team = mongoose.model('Team', TeamSchema);

module.exports = {
  User,
  Team
};
