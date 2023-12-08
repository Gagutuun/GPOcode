const express = require('express');
const errand = require('../models/errand');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post('/', async (req, res, next) => {
    console.log("[DEBUG] запустил обработку");
    const { errandID, status } = req.body;
    await errand.changeStatus(errandID, status)
        .then(() => {
            res.status(200).send("Статус поручения успешно изменен");
            return;
        })
        .catch((err) => {
            console.error('Ошибка при изменении статуса поручения:', err);
            res.status(500).send(err);
            return;
        })
    return;
})

module.exports = router;