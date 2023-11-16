const pool = require('../config/dbConfig');

async function loadTextFromDatabase(errandId) {
  try {
    const query = 'SELECT short_report_doc FROM public."Errand" WHERE id = $1';
    const { rows } = await pool.query(query, [errandId]);

    if (rows.length > 0) {
      const shortReportDoc = rows[0].short_report_doc;
      return shortReportDoc;
    } else {
      console.error('Ошибка: поручение не найдено в базе данных');
      return null;
    }
  } catch (error) {
    console.error('Ошибка при выполнении запроса на получение текста:', error);
    return null;
  }
}

module.exports = { loadTextFromDatabase };