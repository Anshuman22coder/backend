const express = require("express");
const { User } = require("../db");
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

module.exports = app;
