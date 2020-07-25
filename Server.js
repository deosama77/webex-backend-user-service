const express =require('express');
const app =express();
const cors =require('cors');
const bodyParser =require('body-parser');
const userRoutes=require('./routes/user');
const HttpError =require("./utilities/http-error") ;
const config =require('config');

// to handle  different paths and ports
app.use(cors());

// config for header for response
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});
// parse for urlencoded(form) and json format
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

// handle routes
app.use("/users",userRoutes);

//handle error if no route is found .. 404 status
app.use((req,res,next)=>{
  const error=new HttpError("Couldn't find this route",404);
  throw error;
});


// error if any error occurred .. 500 or any status
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });

});
    const port=config.get("App.webServer.port")||4000;
    app.listen(port,function () {
    console.log("Server is running on port "+port)
})
