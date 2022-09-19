let { Pool } = require('pg');

const db_host   = process.env.DB_HOST;
const db_uname  = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_port   = process.env.DB_PORT;
const db_name   = process.env.DB_DATABSE_NAME;

let pool = new Pool({
    host : db_host,
    user : db_uname,
    password : db_password,
    database : db_name,
    port : db_port
})

pool.query('SELECT now()', (error,res) => {
    if(error){
        console.log('Something wrong' + error.message)
    }else{
        console.log('Db connected successfully')
    }
})

module.exports = { pool }