const express = require('express');
const pool = require('../config/dbConfig');
const router = express.Router();

function formatDate(date) {
  if (!date) {
    return ''; // Возвращать пустую строку или другое значение по умолчанию, если дата отсутствует или null
  }

  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',  
  };

  return date.toLocaleDateString('ru-RU', options);
}

router.get('/', async (req, res, next) => {
  try {
    // Запрос к базе данных для получения списка протоколов
    const query = 'SELECT * FROM public."Protocol"';
    const { rows } = await pool.query(query);

    // Проходим по полученным протоколам и форматируем даты
    const formattedReports = rows.map(report => ({
      ...report,
      date: formatDate(report.protocol_date), // Форматируйте дату по вашим требованиям
      // Другие поля, которые нужно отформатировать
    }));

    // Здесь вы можете выполнить дополнительные действия по обработке данных, если это необходимо

    res.render('reportProtocol', { title: 'Отчеты по протоколам', reports: formattedReports });
  } catch (error) {
    console.error('Ошибка при получении протоколов из базы данных:', error);
    next(error);
  }
});

module.exports = router;
