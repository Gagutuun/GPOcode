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

router.get('/:protocolNumber', async (req, res, next) => {
  try {
    // Получите идентификатор протокола из параметров URL
    const { protocolNumber } = req.params;

    // Запрос к базе данных для получения информации о конкретном протоколе по номеру
    const query = 'SELECT * FROM public."Protocol" WHERE protocol_number = $1';
    const { rows } = await pool.query(query, [protocolNumber]);

    if (rows.length === 0) {
      // Обработайте случай, если протокол не найден (можно отобразить ошибку 404)
      res.status(404).render('protocolNotFound', { title: 'Протокол не найден' });
      return;
    }

    // Форматируйте данные по протоколу, как в примере в файле reportProtocol.js
    const formattedReport = {
      ...rows[0],
      date: formatDate(rows[0].protocol_date), // Форматируйте дату по вашим требованиям
      // Другие поля, которые нужно отформатировать
    };

    res.render('oneReportProtocol', { title: 'Отчет по протоколу', report: formattedReport });
  } catch (error) {
    console.error('Ошибка при получении информации о протоколе из базы данных:', error);
    next(error);
  }
});


module.exports = router;
