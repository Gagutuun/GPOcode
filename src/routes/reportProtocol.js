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
    // Запрос к базе данных для получения поручений
    const query = 'SELECT * FROM public."Errand"';
    const { rows } = await pool.query(query);

    // Проходим по полученным поручениям и форматируем даты
    const formattedErrands = rows.map(errand => ({
      ...errand,
      scheduled_due_date: formatDate(errand.scheduled_due_date),
      // Другие поля, которые нужно отформатировать
    }));

    // Здесь вы можете выполнить дополнительные действия по обработке данных, если это необходимо

    res.render('reportProtocol', { title: 'GPO_test', errands: formattedErrands });
  } catch (error) {
    console.error('Ошибка при получении поручений из базы данных:', error);
    next(error);
  }
});

module.exports = router;
