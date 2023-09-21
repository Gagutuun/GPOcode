const { makeInsertQuery, makeSelectQuery } = require('../../src/utils/queryBuilder');

describe('Testing SQL Query generator', () => {
  test('should generate correct insert query', () => {
    const tableName = 'users';
    const columnNames = ['name', 'age', 'email'];
    const nArgs = columnNames.length;
    const sqlQuery = makeInsertQuery(tableName, columnNames, nArgs);

    expect(sqlQuery).toBe('INSERT INTO users (nameageemail) VALUES ($1, $2, $3)');
  });

  test('should generate correct select query', () => {
    const columnNames = ['name', 'age', 'email'];
    const tableName = 'users';
    const whenExpression = 'age > 18';
    const groupByExpression = 'name';
    const orderByExpression = 'age DESC';

    const sqlQuery = makeSelectQuery(columnNames, tableName, whenExpression, groupByExpression, orderByExpression);

    expect(sqlQuery).toBe('SELECT name, age, email FROM users WHEN age > 18 GROUP BY name ORDER BY age DESC');
  });
});
