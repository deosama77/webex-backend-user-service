const routes=require('express').Router();
const {getUsers,getUser,createUser,login,getUserInfoFromToken}
= require('../queries/query-user');
const verifyToken=require('../utilities/verify-token');
const { check } = require('express-validator');
const {checkInputUser} =require('../utilities/input-validation/input-creat-user')

// all routes for user operations ....
routes.get("/",verifyToken,getUsers);

// sign up or crate new user with check input values
routes.post("/sign_up", checkInputUser(), createUser);

// provide token and userid - then will check if userId and token information if match
routes.post("/token",verifyToken,getUserInfoFromToken)

// log in - email and password is required
routes.post('/login',login);

// get user information by id
routes.get("/:id",verifyToken,getUser);

module.exports=routes;
