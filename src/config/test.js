const db = require('./dbConfig');

db.query('SELECT table_name, column_name FROM information_schema.columns where table_schema="public"', (error, result) => {
    console.log(error);
});