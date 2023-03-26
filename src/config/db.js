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

// Пример использования
// const pool = require('./config/database.js');

// // Выполняем SQL-запрос при помощи экспортированного метода query
// pool.query('SELECT * FROM users', (error, results) => {
//   if (error) {
//     throw error;
//   }
//   console.log(results.rows);
// });