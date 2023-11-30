const express = require('express');
const pool = require('../config/dbConfig');
const router = express.Router();
const { createTable } = require('../utils/savetopdf');

const getErrandsFromDatabase = async (protocolNumber) => {
  try {
    const query = `
      SELECT *
      FROM "Errand" E
      INNER JOIN "ErrandEmployee" EE ON E.id = EE.id_errand
      INNER JOIN "Protocol" P ON E.id_protocol = P.id
      INNER JOIN "Employee" Em ON Em.id = EE.id_employee
      WHERE P.protocol_number = $1
    `;

    const { rows } = await pool.query(query, [protocolNumber]);
    console.log(rows)
    return rows;
  } catch (error) {
    console.error('An error occurred while getting the errands data from the database:', error);
    throw error;
  }
};

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
};

router.get('/', async (req, res, next) => {
  try {
    // Запрос к базе данных для получения списка активных протоколов, где general_report_file_doc пустое
    const activeQuery = `
      SELECT * FROM public."Protocol"
      WHERE general_report_file_doc IS NULL
      ORDER BY protocol_date DESC; -- Сортировка по дате в убывающем порядке
    `;
    const { rows: activeReports } = await pool.query(activeQuery);

    // Запрос к базе данных для получения списка архивных протоколов, где general_report_file_doc не пустое
    const archiveQuery = `
      SELECT * FROM public."Protocol"
      WHERE general_report_file_doc IS NOT NULL
      ORDER BY protocol_date DESC; -- Сортировка по дате в убывающем порядке
    `;
    const { rows: archiveReports } = await pool.query(archiveQuery);

    // Проходим по полученным протоколам и форматируем даты для активных протоколов
    const formattedActiveReports = activeReports.map(report => ({
      ...report,
      date: formatDate(report.protocol_date), // Форматируйте дату по вашим требованиям
      // Другие поля, которые нужно отформатировать
    }));

    // Проходим по полученным протоколам и форматируем даты для архивных протоколов
    const formattedArchiveReports = archiveReports.map(report => ({
      ...report,
      date: formatDate(report.protocol_date), // Форматируйте дату по вашим требованиям
      // Другие поля, которые нужно отформатировать
    }));

    // Здесь вы можете выполнить дополнительные действия по обработке данных, если это необходимо

    res.render('reportProtocol', {
      title: 'Отчеты по протоколам',
      activeReports: formattedActiveReports,
      archiveReports: formattedArchiveReports,
    });
  } catch (error) {
    console.error('Ошибка при получении протоколов из базы данных:', error);
    next(error);
  }
});



router.get('/:protocolNumber', async (req, res, next) => {
  try {
    // Получите идентификатор протокола из параметров URL
    const { protocolNumber } = req.params;

    // Запрос к базе данных для получения информации о конкретном протоколе и связанных с ним поручениях
    const query = `
        SELECT
        p.*,
        e.id as errand_ID,
        e.text_errand,
        e.actual_date,
        e.scheduled_due_date,
        e.status,
        e.constantly,
        ARRAY_AGG(DISTINCT CONCAT(emp.surname, ' ', emp.name, ' ', emp.patronymic)) AS responsible_employees
      FROM
        public."Protocol" AS p
      LEFT JOIN
        public."Errand" AS e ON p.id = e.id_protocol
      LEFT JOIN
        public."ErrandEmployee" AS ee ON e.id = ee.id_errand
      LEFT JOIN
        public."Employee" AS emp ON ee.id_employee = emp.id
      WHERE
        p.protocol_number = $1
      GROUP BY
        p.id, e.id;
    `;
    const { rows } = await pool.query(query, [protocolNumber]);
    if (rows.length === 0) {
      // Обработайте случай, если протокол не найден (можно отобразить ошибку 404)
      res.status(404).render('protocolNotFound', { title: 'Протокол не найден' });
      return;
    }

    const formattedProtocols = [];

    // Переберите полученные строки (протоколы) и добавьте их в массив formattedProtocols
    for (const row of rows) {
      formattedProtocols.push({
        ...row, // Сохраняем все поля объекта
        date: formatDate(row.protocol_date),
        scheduled_due_date: formatDate(row.scheduled_due_date), // Форматируем дату
        protocol_date: formatDate(row.protocol_date)
      });
    }

    console.log(formattedProtocols)

    res.render('OneReportProtocol', { title: 'Отчет по протоколу', protocol: formattedProtocols });
  } catch (error) {
    console.error('Ошибка при получении информации о протоколе из базы данных:', error);
    next(error);
  }
});

router.post('/:protocolNumber/generate-report', async (req, res) => {
    const protocolNumber = req.params.protocolNumber
    const errands = await getErrandsFromDatabase(protocolNumber);
    await createTable(errands);
});



module.exports = router;
