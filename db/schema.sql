DROP DATABASE IF EXISTS webex;
CREATE DATABASE webex;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   first_name TEXT,
   last_name TEXT,
   password TEXT,
   email TEXT


);

INSERT INTO users(first_name,last_name,email)
values('osama','Almadhoun','osama@come');

