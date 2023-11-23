const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  // Проверяем, есть ли данные для предпросмотра в session
  if (!req.session.reportData) {
    return res.redirect('/'); 
  }

  // Отображаем страницу предпросмотра
  res.render('reportReview', {
    title: 'Предварительный просмотр',
    reportData: req.session.reportData 
  });

});

router.post('/review-report', (req, res) => {
  
  // Получаем отредактированные данные из формы
  const editedReportData = req.body;
  
  // Сохраняем обратно в session
  req.session.reportData = editedReportData;

  // Перенаправляем на генерацию PDF
  return res.redirect('/generate-pdf');

});

module.exports = router;