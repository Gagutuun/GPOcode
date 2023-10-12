const express = require('express');
const pool = require('../config/dbConfig')
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

    res.render('errand', { title: 'Поручения', errands: formattedErrands });
  } catch (error) {
    console.error('Ошибка при получении поручений из базы данных:', error);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Запрос к базе данных для получения информации о конкретном поручении с данными об ответственном сотруднике
    const query = `
      SELECT e.*, errand.*
      FROM public."Employee" AS e
      INNER JOIN public."ErrandEmployee" AS ee ON e.id = ee.id_employee
      INNER JOIN public."Errand" AS errand ON ee.id_errand = errand.id
      WHERE errand.id = $1;    
    `;
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      // Обработайте случай, если поручение не найдено (можно отобразить ошибку 404)
      res.status(404).render('errandNotFound', { title: 'Поручение не найдено' });
      return;
    }

    // Форматируйте данные по поручению, включая даты
    const formattedErrand = {
      ...rows[0],
      scheduled_due_date: formatDate(rows[0].scheduled_due_date),
      // Другие поля, которые нужно отформатировать
    };

    console.log({rows})
    // Передайте данные о поручении и ответственном сотруднике на страницу OneErrand.pug
    res.render('OneErrand', { title: 'Поручение', errand: formattedErrand });
  } catch (error) {
    console.error('Ошибка при получении информации о поручении из базы данных:', error);
    next(error);
  }
});



module.exports = router;
