const express = require('express');
const protocol = require('../models/protocol');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post('/', async (req, res, next) => {
    console.log("[DEBUG] запустил обработку");
    const { idProtocol, FilePath } = req.body;
    await protocol.updateGeneralReportFilePath(idProtocol, FilePath)
        .then(() => {
            res.status(200).send("Путь до отчета добавлен");
            return;
        })
        .catch((err) => {
            console.error('Ошибка при добавлении пути:', err);
            res.status(500).send(err);
            return;
        })
    return;
})

module.exports = router;