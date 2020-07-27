const HttpError=require('./http-error');
const jwt=require('jsonwebtoken');
const config =require('config');

const verifyToken=function (req,res,next) {
         try {
             if (req.method === 'OPTIONS') {
                 return next();
             }
             const token=req.headers.authorization.split(' ')[1]
             const decodeToken=jwt.verify(token,
                 process.env.SECRETTOKEN||config.get("App.token.secret")
                 // process.env.secret
                 ,
             );
             // console.log("decodeToken ",decodeToken)
             // console.log("token",token)
              req.body.data=decodeToken;
              req.body.token=token;
             if(!token){
                 throw new Error("Authentication failed")
             }
             next();
         } catch (e) {
          return  next(new HttpError("Authentication failed",403))
         }
}

module.exports=verifyToken;
