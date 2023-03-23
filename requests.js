const db = require('./db');

async function addProtokol(name, age) {
  try {
    const res = await db.query('INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id', [name, age]);
    const id = res.rows[0].id;
    
    console.log(`Пользователь с id ${id} добавлен в базу данных`);
  } catch (err) {
    console.error(err.message);
  }
}