const express = require('express');
const pool = require('../config/dbConfig')
const router = express.Router();

const Errand = require('../models/errand'); // Здесь подключите вашу модель Errand

// Маршрут для редактирования отчета по поручению
router.get('/edit-errand-report/:errandId', async (req, res) => {
  try {
    const errandId = req.params.errandId;
    const errand = await Errand.getErrandById(errandId); // Замените на ваш метод для получения поручения по ID

    if (!errand) {
      // Обработка случая, если поручение не найдено
      return res.status(404).send('Поручение не найдено');
    }

    res.render('editOneErrand', { errand });
  } catch (error) {
    // Обработка ошибки, если не удается получить поручение
    res.status(500).send('Произошла ошибка');
  }
});

module.exports = router;