const express = require("express");
const { User ,Team} = require("../db");
const userMiddleware = require("../middleware/user");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const zod = require("zod");

// Validation function using Zod
function check(obj) {
  const schema = zod.object({
    username: zod.string().min(5).max(20).transform(str => str.toLowerCase()), // Convert username to lowercase
    password: zod.string().min(8).max(20).regex(/[0-9]/, "Password must contain at least one number"), // Ensure password contains a number
    age: zod.number().min(10)
  });

  return schema.safeParse(obj);  // Return detailed validation result
}

app.post("/signup", async (req, res) => {
  const { username, password, age } = req.body;

  // Validate input using Zod
  const response = check({ username, password, age });

  // If validation fails, respond with an error

  if (!response.success) {
    return res.json({
      response: "not success",
      msg: response.error.issues.map(issue => issue.message).join(", ")  // Combine validation errors into a single string
    });
 
  }

  try {
    // Get the lowercase username from the Zod validation result
    const username2 = response.data.username;

    // Check if the user already exists
    const user = await User.findOne({ username: username2 });
    if (user) {
      return res.json({
        msg: "User already exists, please sign in!"
      });
    }

    // Create the user in the database
    await User.create({ username: username2, password, age });
    return res.json({
      response: true,
      message: "User created successfully"
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      response: false,
      msg: "Internal server error"
    });
  }
});

app.get("/login", userMiddleware, async (req, res) => {
  // Show welcome page if login is successful
  res.json({
    success: true
  });
});

app.post('/createTeam', async (req, res) => {
  const { teamName, members } = req.body;

  try {
      const users = await User.find({ username: { $in: members } });

      if (users.length !== members.length) {
          return res.status(400).json({ message: 'Some usernames do not exist.' });
      }

      const newTeam = new Team({
          teamName: teamName,
          members: users.map(user => user.username) // Storing member usernames
      });

      await newTeam.save();
      await User.updateMany(
        { username: { $in: members } }, // Find users in the members array
        { $set: { teamName: teamName } } // Update the teamName field for each user
    );
      res.status(200).json({ message: 'Team created successfully!' });
      

  } catch (err) {
      res.status(500).json({ error: 'Server error.' });
  }
});
app.get("/checkUserTeam", async (req, res) => {
  try {
    const username = req.query.username; // Get username from query parameters

    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user has a teamName
    const { teamName } = user;
    if (!teamName) {
      return res.status(200).json({ exists: false, message: 'No team assigned.' });
    }

    // If teamName exists, check if the team exists and return details
    const team = await Team.findOne({ teamName: teamName });
    if (team) {
      return res.status(200).json({
        exists: true,
        team: team // Return team details if found
      });
    } else {
      return res.status(404).json({ exists: false, message: 'Team not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

      


app.get("/getTeam",async (req,res)=>{

  try {
    
    const teamName = req.query.teamName;


    // Check if the user already exists
    const team = await Team.findOne({ teamName:teamName });
    if (team) {
      
        res.status(200).json({
          check:true,
          team:team});
      
    }
    else{
      return res.status(404).json({ 
        check:false,
        message: 'Team not found.' });
    }
}
catch(err)
{
      console.error(err);
    res.status(500).json({ error: 'Server error.' });
}})

module.exports = app;
