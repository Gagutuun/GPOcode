const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig')
const ProtocolModel = require('../models/protocol');

const helloRouter = require('./helloRouter');
const uploadRouter = require('./uploadRouter');
const LoadRouter = require('./LoadRouter');
const authRouter = require('./authRouter');
const pdfRouter = require('./pdfRouter');
const errands = require('./errands');
const reportProtocol = require('./reportProtocol');
const feedback = require('./feedback');
const profile = require('./personRouter');
const reportReview = require('./reportReviewRouter')


// Use routes
router.use('/', helloRouter);
router.use('/upload', LoadRouter);
router.use('/auth', authRouter);
router.use('/pdf', pdfRouter);
router.use('/uploadProtocol', uploadRouter);
router.use('/errand', errands);
router.use('/reportProtocol', reportProtocol);
router.use('/feedback', feedback);
router.use('/profile', profile);
router.use('/review-report', reportReview);

// Обновленный обработчик POST-запроса
router.post('/confirm', async (req, res) => {
  try {
    const { errandArray } = req.body;

    // Здесь добавьте логику для вставки данных в таблицы Errand и ErrandEmployee
    for (const errandData of errandArray) {
      const { errandText, parsedAsgnName, deadline, selectedEmployeeId } = errandData;
      const idProtocol = await ProtocolModel.getLastProtocolId();
      // Вставка данных в таблицу Errand
      let errandInsertQuery, errandValues;

      if (deadline === 'постоянно') {
        errandInsertQuery = `
          INSERT INTO public."Errand" (perfomers_protocol, text_errand, constantly, id_protocol, status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id;`;

        errandValues = [parsedAsgnName, errandText, true, idProtocol, 'Активно'];
      } else {
        errandInsertQuery = `
          INSERT INTO public."Errand" (perfomers_protocol, text_errand, scheduled_due_date, id_protocol, status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id;`;

        errandValues = [parsedAsgnName, errandText, deadline, idProtocol, 'Активно'];
      }

      const errandResult = await pool.query(errandInsertQuery, errandValues);
      const errandId = errandResult.rows[0].id;

      // Вставка данных в таблицу ErrandEmployee
      const errandEmployeeInsertQuery = `
        INSERT INTO public."ErrandEmployee" (id_errand, id_employee, report)
        VALUES ($1, $2, $3);`;

      const errandEmployeeValues = [errandId, selectedEmployeeId, '']; // 'report' пока что пустой
      await pool.query(errandEmployeeInsertQuery, errandEmployeeValues);
    }

    // Отправка успешного ответа
    res.status(200).json({ success: true, message: 'Данные успешно подтверждены' });
  } catch (error) {
    console.error('Произошла ошибка при обработке POST-запроса', error);

    // Отправка ответа об ошибке
    res.status(500).json({ success: false, message: 'Произошла ошибка при обработке запроса' });
  }
});



module.exports = router;
