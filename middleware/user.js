const{User}=require("../db");
function userMiddleware(req,res,next)
{
  const {username,password,age}=req.query;
  User.findOne({
    username:username,
    password:password
  })
  .then(function(value){
   if(value){
    next();//user found . please proceed..
   }
   else{
    res.status(403).json({
     success:false,
     msg:"Invalid username or password"
    })
   }
  })
.catch((err) => {
  res.status(500).json({
    success: false,
    message: "Error checking credentials",
    error: err.message,
  });
});
}

module.exports=userMiddleware;
