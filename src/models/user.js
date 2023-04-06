const db = require('../config/dbConfig');


class User {
  // Изменим название метода, чтобы оно точнее отражало его назначение
  static findByLoginAndPassword(login, password) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM public."Employee" WHERE login = $1 AND password = $2', [login, password], (error, result) => {
        if (error) {
          // Заменим console.log на reject, чтобы можно было обработать ошибку в вызывающем коде
          reject(error);
        } else if (result.rows.length > 0) {
          const {id, login, password} = result.rows[0]; // Деструктурируем объект
          resolve({ id, login, password }); // Объект можно создать короче
        } else {
          resolve(null);
        }
      });
    });
  }


  // Исправим запрос, чтобы он сравнивал id, а не login
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM public."Employee" WHERE id = $1', [id], (error, result) => {
        if (error) {
          reject(error);
        } else if (result.rows.length > 0) {
          const {id, login, password} = result.rows[0];
          resolve({ id, login, password });
        } else {
          resolve(null);
        }
      });
    });
  }
}


module.exports = User;