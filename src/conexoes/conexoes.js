const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
})

const poolQuery = (texto, parametro) => {
    return pool.query(texto, parametro);
}

module.exports = {
    poolQuery
}