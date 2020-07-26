const jwt=require('jsonwebtoken')
const db =require('../db/index');
const { validationResult } = require('express-validator');
const HttpError=require('../utilities/http-error');
const config =require('config');
const bcryptjs=require('bcryptjs');

// get users (must authorization)
const getUsers=async (req,res,next)=>{
    try{
        const users=await db.any("select * from users")
        res.status(200).json({
            info:req.user,
            users:users,
            message:"Successfully users is fetched ..."
        })
    } catch (e) {
        console.log(e);
        return next(new HttpError("Error : "+e))
    }

}

// get user (must authorization)
const getUser=async (req,res,next)=>{
    const userId=req.params.id;
    const {data,token}=req.body;
    // console.log(req.body)
    // console.log("id",userId.toString()!==data.user.id.toString())
    // check id from token with id from params , or not authorization
    if(!data||userId.toString()!==data.user.id.toString()||!token){
        return next (new HttpError("Failed Authorization",401))
    }
    try{
        const user=await db.one("select * from users where id="+req.params.id)
        res.json({
            user:user,
            status:"success",
            message:"one user fetched"
        })
    } catch (e) {
        console.log(e)
       return  next(new HttpError("An error occurred while fetching the user",500))
    }


}

// sign up or create new user .
const createUser=async (req,res,next)=>{
    let hashedPassword;
    //  encrypt password
    try{
        hashedPassword=await bcryptjs.hash(req.body.password,12);
        req.body.hashedPassword=hashedPassword;
    }catch (e) {
        return next(new HttpError("Couldn't create user , please try again later",500))
    }


    try{
        //validation body values -
        const errors = validationResult(req);
        console.log("Input Errors : ..",errors)
        if (!errors.isEmpty()) {
            return next(
                new HttpError('Invalid inputs passed, please check your data.', 422)
            );
        }

        // validate if users exist - if exist then error user exists already
        const isExistUser=await db.any("SELECT * FROM users WHERE email=$1",[req.body.email]);
        if(isExistUser.length!==0){
            return next(new HttpError('User exists already, please login instead.',
                422))
        }

        //  insert user information in data base
        const user=await db.one("INSERT INTO users(first_name,last_name,email,password,date_birth,is_terms)" +
            "values(${first_name},${last_name},${email},${hashedPassword},${date_birth},${is_terms}) RETURNING *",req.body)
          user.password=undefined
        // return values
        res.status(201).json({
            user,
            status:"success",
            message:"1 user is created"
        })
    }catch (e) {
        console.log(e)
       return  next(new HttpError('Created new user is failed - server error',500));

    }

}

// login and verify values
const login =async (req,res,next)=>{
    const password=req.body.password;
    const email=req.body.email;

    // expire 1 hour for token
    const expireIn=60*60;
    let existingUser;
    try{
        existingUser= await db.any("SELECT * FROM users WHERE " +
            "email=$1",[email]);
    }catch (e) {
           return next(new HttpError("Logging in failed please try again later",500))
    }
    if(existingUser.length===0){
        return  next(new HttpError("Invalid username or password,couldn't log you in",401))
    }

    // check hashed password
    let isValidPassword=false;
    try {
       isValidPassword=await bcryptjs.compare(password,existingUser[0].password)
    }catch (e) {
     return next(new HttpError("Couldn't log you in , please try again later",500))
    }

    if(!isValidPassword){
        return next(new HttpError("Invalid username or email  ,couldn't log you in "
            ,401))
    }
    //  generated token - secret key in config
    try{
        jwt.sign({user:existingUser[0]},config.get("App.token.secret"),{expiresIn: `${expireIn}s`}
        ,(err,token)=>{
            if(err){
                return next(new HttpError("Couldn't log you in , please try again later",500));
            }
                res.status(200).json({
                    user:{id:existingUser[0].id,email:existingUser[0].email ,
                        first_name:existingUser[0].first_name},
                    token,
                    status:"success",
                    message:"1 user is fetched- login in success"
                })
        })

    } catch (e) {
        console.log(e)
        return next(new HttpError("An error occurred during login process",500))
    }




}
// **********************End created user ********************

// get information after verify token and return user details
const getUserInfoFromToken=(req,res,next)=>{
    // console.log("body ",req.body)
    // check if (uer id === user token) or, not empty user and token
    const {userId,data,token}=req.body;

          if(!data||userId.toString()!==data.user.id.toString()||!token){
              return next (new HttpError("Failed Authorization",401))
          }
           res.status(200).json({status:'success',data:req.body.data
           ,token:req.body.token})
}


module.exports={getUsers,getUser,createUser,login
    ,getUserInfoFromToken};
