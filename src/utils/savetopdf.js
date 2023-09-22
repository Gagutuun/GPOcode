const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const CONSTANTS = require(__dirname + '/font');
const QuerryBuilder = require('../utils/queryBuilder'); // Подключаем QuerryBuilder
const pool = require('../config/dbconfig'); // Подключаем настройки подключения к базе данных
const fs = require('fs');

// Создаем новый документ
const doc = new jsPDF({
  orientation: 'landscape',
});

const myFont = CONSTANTS.font; // load the *.ttf font file as a binary string

// add the font to jsPDF
doc.addFileToVFS('MyFont.ttf', myFont);
doc.addFont('MyFont.ttf', 'MyFont', 'normal');
doc.setFont('MyFont');

const introText =
    'Перечень поручений и отчетов по протоколу производственного совещания при генеральном директоре по направлению деятельности заместителя генерального директора по управлению персоналом от 27.12.2021 № 20';

const headers = ['№ по протоколу', 'Поручение', 'Ответственный / Срок / Пояснения'];

// Выполните запрос к базе данных для получения данных о поручениях
const getErrandsFromDatabase = async () => {
  try {
    const query = QuerryBuilder.makeSelectQuery('public."Errand"', {
      columnNames: ['id', 'text_errand', 'id_responsible', 'scheduled_due_date', 'constantly'],
      // Добавьте другие параметры запроса, если необходимо
    });

    const { rows } = await pool.query(query);

    return rows;
  } catch (error) {
    console.error('Ошибка при получении данных о поручениях из базы данных:', error);
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
}

const createTable = async () => {
  const errands = await getErrandsFromDatabase(); // Получаем данные о поручениях из базы данных

  // Создаем массив данных для таблицы
  const tableData = [];

  doc.text(introText, doc.internal.pageSize.width / 2, 10, { align: 'center', overwlow: 'linebreak', maxWidth:  280, fontSize: 12});

  // Заполняем массив данными
  errands.forEach((errand, index) => {
    // Формируем данные для каждой строки таблицы
    const row1 = [
      { content: errand.text_errand.split('.').shift() + '.', rowSpan: 2, styles: {halign: 'center'}}, // Объединяем две ячейки в столбце № по протоколу
      {content: errand.text_errand.split('.').slice(1).join('.').trim(), styles: { fillColor: [222, 234, 246] }}// Берем оставшуюся часть текста поручения
    ];

    const row2 = [
    ];

    if (errand.constantly) {
      row1.push({ content: 'Ответственные - заместители генерального директора.\nСрок исполнения - постоянно', styles: { fillColor: [222, 234, 246] } });
    } else {
      row1.push({ content: `Ответственные - заместители генерального директора.\nСрок исполнения - ${formatDate(errand.scheduled_due_date)}`, styles: { fillColor: [222, 234, 246] } });
    }

    // Создайте переменные для краткого и развернутого отчетов, которые будут получены из базы данных
    const briefReport = 'Краткий отчет для директум.'; // Замените на данные из базы данных
    const detailedReport = 'Развернутый отчет.Развернутый отчет.Развернутый отчет.Развернутый отчет.Развернутый отчет.Развернутый отчет.'; // Замените на данные из базы данных

    row2.push(briefReport);
    row2.push(detailedReport);

    // Добавляем данные в массив таблицы
    tableData.push(row1);
    tableData.push(row2);
  });

  // Определение параметров таблицы
  const tableOptions = {
    startY: 24,
    head: [headers],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'MyFont',
      //valign: 'middle',
      overflow: 'linebreak',
      cellWidth: 'auto',
      fontSize: 10,
      textColor: [0, 0, 0],
      lineColor: Color = 5,
      lineWidth: border = 0.5,
    },
    headStyles: {
      halign: 'center',
      fillColor: [255, 255, 255],
      fontStyle: 'bold',
    }
  };

  // Создаем таблицу с помощью auto-table
  doc.autoTable(tableOptions);

  // Сохраняем документ
  doc.save('table.pdf');
};


// Вызываем функцию для создания таблицы
createTable();
