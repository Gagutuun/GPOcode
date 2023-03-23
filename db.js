const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'local',
  database: 'postgres',
  password: '1234',
  port: '5432',
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
