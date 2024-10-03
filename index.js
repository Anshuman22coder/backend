const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());  // Enable CORS for all routes

const userRouter = require("./routes/user");

//middleware for parsing request bodies..
app.use(bodyParser.json());
app.use("/user",userRouter)
const PORT=3000;
app.listen(PORT,()=>
{
  console.log(`Server is running on port ${PORT}`);
});
