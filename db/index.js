try{
    // const config=require('config');
    let pgp = require('pg-promise')({})
    let db = pgp(process.env.DATABASE_URL)
    module.exports=db;
}catch (e) {
    console.log("Data base error connection ",e)
}

