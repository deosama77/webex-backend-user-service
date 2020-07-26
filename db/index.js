try{
     const config=require('config');
    let pgp = require('pg-promise')({})
    // deploy .....
    // let db = pgp(process.env.DATABASE_URL)
    db = pgp(config.get("App.postgreSQL.url"))
    module.exports=db;
}catch (e) {
    console.log("Data base error connection ",e)
}

