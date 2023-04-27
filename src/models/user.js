const db = require('../config/dbConfig');
const queryBuilder = require('../utils/queryBuilder');



class User {
  static tableName = 'public."Employee"';
  static columnNames = {
    id: 'id',
    surname: 'surname',
    name: 'name',
    patronymic: 'patronymic',
    login: 'login',
    ssword: 'password',
    position: 'position',
    role: 'role',
    category: 'category',
    subdivisionShortName: 'subdivision_short_name'
  };
  // Изменим название метода, чтобы оно точнее отражало его назначение
  static findByLoginAndPassword(login, password) {
    return new Promise((resolve, reject) => {
      // db.query('SELECT * FROM public."Employee" WHERE login = $1 AND password = $2', [login, password], (error, result) => { 
      //   if (error) {
      //     // Заменим console.log на reject, чтобы можно было обработать ошибку в вызывающем коде
      //     reject(error);
      //   } else if (result.rows.length > 0) {
      //     const {id, login, password} = result.rows[0]; // Деструктурируем объект
      //     resolve({ id, login, password }); // Объект можно создать короче
      //   } else {
      //     resolve(null);
      //   }
      // });
      db.query(
        queryBuilder.makeSelectQuery(
          null,
          this.tableName,
          queryBuilder.makeWhereExpression(
            "login = $1",
            queryBuilder.AND,
            "password = $2"
          )
        ),
        [login, password],
        (error, result) => {
          if (error)
            reject(error);
          else if (result.rows.length > 0) {
            const { id, login, password } = result.rows[0];
            resolve({ id, login, password });
          } else
            resolve(null);
        }
      )
    });
  }


  // Исправим запрос, чтобы он сравнивал id, а не login
  static findById(id) {
    return new Promise((resolve, reject) => {
      // db.query('SELECT * FROM public."Employee" WHERE id = $1', [id], (error, result) => {
      //   if (error) {
      //     reject(error);
      //   } else if (result.rows.length > 0) {
      //     const {id, login, password} = result.rows[0];
      //     resolve({ id, login, password });
      //   } else {
      //     resolve(null);
      //   }
      // });
      db.query(
        queryBuilder.makeSelectQuery(
          null,
          this.tableName,
          queryBuilder.makeWhereExpression("id = $1")
        ),
        [id],
        (error, result) => {
          if (error)
            reject(error);
          else if (result.rows.length > 0) {
            const { id, login, password } = result.rows[0];
            resolve({ id, login, password });
          } else
            resolve(null);
        }
      )
    });
  }
}


module.exports = User;