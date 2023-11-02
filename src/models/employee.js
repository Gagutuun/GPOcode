const db = require('../config/dbConfig');
const queryBuilder = require('../utils/queryBuilder');

class Employee {
  static tableName = 'public."Employee"';
  static columnNames = {
    id: 'id',
    surname: 'surname',
    name: 'name',
    patronymic: 'patronymic',
    login: 'login',
    password: 'password',
    position: 'position',
    role: 'role',
    category: 'category',
    subdivisionShortName: 'subdivision_short_name'
  };
  // Изменим название метода, чтобы оно точнее отражало его назначение
  static findByLoginAndPassword(login, password) {
    return new Promise((resolve, reject) => {
      db.query(
        queryBuilder.makeSelectQuery(
          this.tableName,
          {
            whereExpression: queryBuilder.makeSubexpression(
              queryBuilder.WHERE,
              queryBuilder.makeLogicExpression(
                queryBuilder.AND,
                queryBuilder.equals(this.columnNames.login),
                queryBuilder.equals(this.columnNames.password)
              )
            )
          }
        ),
        [login, password],
        (error, result) => {
          if (error) {
            reject(error);
          }
          else if (result.rows.length > 0) {
            const { id, login, password } = result.rows[0];
            resolve({ id, login, password });
          } else {
            resolve(null);
          }
        }
      )
    });
  }

  // Исправим запрос, чтобы он сравнивал id, а не login
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        queryBuilder.makeSelectQuery(
          this.tableName,
          {
            whereExpression: queryBuilder.makeSubexpression(
              queryBuilder.WHERE,
              queryBuilder.equals(this.columnNames.id)
            )
          }
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

  /**
   * Ищет пользователя по его ФИО
   * @param {{
   * ZGD: boolean | false;
   * lastName: string | undefined;
   * firstName: string | undefined;
   * middleName: string | undefined;
   * shortForm: boolean | false;
   * }} fio - ФИО пользователя
   * @returns промис на id пользователя в бд либо -1, если не нашел
   */
  static findByName(fio) {
    return new Promise((resolve, reject) => {
      if (!fio) {
        reject("Не определенный пользователь!");
        return;
      }
      fio.ZGD = fio.ZGD || false;
      fio.shortForm = fio.shortForm || false;
      db.query(
        queryBuilder.makeSelectQuery(
          this.tableName,
          {
            columnNames: this.columnNames.id,
            whereExpression: queryBuilder.makeSubexpression(
              queryBuilder.WHERE,
              fio.ZGD
                ? queryBuilder.equals(this.columnNames.name)
                : queryBuilder.makeLogicExpression(
                  queryBuilder.AND,
                  queryBuilder.equals(this.columnNames.surname),
                  queryBuilder.makeLogicExpression(
                    queryBuilder.AND,
                    fio.shortForm
                      ? queryBuilder.like(this.columnNames.name)
                      : queryBuilder.equals(this.columnNames.name),
                    fio.shortForm
                      ? queryBuilder.like(this.columnNames.patronymic)
                      : queryBuilder.equals(this.columnNames.patronymic)
                  )
                )
            )
          }
        ),
        fio.ZGD
          ? ["Заместители генерального директора"]
          : fio.shortForm
            ? [
              fio.lastName,
              fio.firstName.replace('.', '%'),
              fio.middleName.replace('.', '%')
            ]
            : [
              fio.lastName,
              fio.firstName,
              fio.middleName
            ],
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (result.rowCount > 0) {
            resolve(result.rows);
            return;
          }
          resolve([{ id: -1 }]);
          return;
        }
      )
    });
  }
}

module.exports = Employee;

Employee.findByName({ lastName: "Семенов", firstName: "А.", middleName: "Б.", shortForm: true })
  .then((result) => {
    console.log(result);
    return;
  })
  .catch((error) => {
    console.error(error);
    return;
  })