const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
    override: true,
    path: path.join(__dirname,'development.env')
});
const {Pool , Client} = require('pg');

const pool = new Pool({
    user : process.env.USER,
    host : process.env.HOST,
    database : process.env.DATABASE,
    password : process.env.PASSWORD,
    port : process.env.PORT
});



pool.on("connect", ()=>{
    console.log("Database connected");
});

pool.on("end", () =>{
    console.log("Connection Terminated");
})

module.exports = pool;