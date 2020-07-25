const config=require('config');
let pgp = require('pg-promise')({})
let db = pgp(config.get('App.postgreSQL.url'))
module.exports=db;
