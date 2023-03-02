const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    max: 20,
    password: 'admin',
    database: 'bd'
})

module.exports = {
    
}