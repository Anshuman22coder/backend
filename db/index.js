const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin:cQYKlyRCbZZX7PBp@anshuman.l4xvw.mongodb.net/NASA2");


//definning schemas 
const UserSchema=new mongoose.Schema({
  //schema definition:::
  username:String,
  password:String,
  age:Number

})
const User=mongoose.model('User',UserSchema);//modelling an db
module.exports={
  User
};

