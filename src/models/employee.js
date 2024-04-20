const queryBuilder = require('../utils/queryBuilder');
/**
 * Модель сотрудника
 */
class Employee {
	/**
	 * Имя таблицы в базе данных
	 */
	static tableName = 'public."Employee"';
	/**
	 * Имена колонок в данной таблице
	 */
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
	/**
	 * Ищет сотрудника по логину и паролю
	 * @param {string} login - Логин
	 * @param {string} password - Пароль
	 * @returns Промис выполнения запроса
	 */
	static findByLoginAndPassword(login, password) {
		return queryBuilder.select(
				[],
				this.tableName
			).where(`${this.columnNames.login} = ? AND ${this.columnNames.password} = ?`, [login, password])
			.exec();
	}
	/**
	 * Ищет сотрудника по id
	 * @param {number} id - ID
	 * @returns Промис выполнения запроса
	 */
	static findById(id) {
		return queryBuilder.select(
				[],
				this.tableName
			).where(`${this.columnNames.id} = ?`, [id])
			.exec();
	}
}

module.exports = Employee;