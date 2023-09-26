const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const MyFont = require(__dirname + '/fonts/font');
const MyFontItalic = require(__dirname + '/fonts/times-new-roman-italique-italic')
const MyFontBold = require(__dirname + '/fonts/times-new-roman-gras-bold')
const QuerryBuilder = require('../utils/queryBuilder'); // Подключаем QuerryBuilder
const pool = require('../config/dbConfig'); // Подключаем настройки подключения к базе данных
const fs = require('fs');

// Create a new document
const doc = new jsPDF({
  orientation: 'landscape',
});

const myFont = MyFont.font;
const myFontItalic = MyFontItalic.font;
const myFontBold = MyFontBold.font;

// Add the fonts to jsPDF
doc.addFileToVFS('MyFont.ttf', myFont);
doc.addFileToVFS('MyFontItalic.ttf', myFontItalic);
doc.addFileToVFS('MyFontBold.ttf', myFontBold);

doc.addFont('MyFont.ttf', 'MyFont', 'normal');
doc.addFont('MyFontItalic.ttf', 'MyFont', 'italic');
doc.addFont('MyFontBold.ttf', 'MyFont', 'bold');
doc.setFont('MyFont', 'bold');
doc.setFontSize(15);

const introText =
  'Перечень поручений и отчетов по протоколу производственного совещания при генеральном директоре по направлению деятельности заместителя генерального директора по управлению персоналом от 27.12.2021 № 20';

const headers = ['№ по протоколу', 'Поручение', 'Ответственный / Срок / Пояснения'];

// Execute the database query to get the errands data
const getErrandsFromDatabase = async () => {
  try {
    const query = QuerryBuilder.makeSelectQuery('public."Errand"', {
      columnNames: ['id', 'text_errand', 'id_responsible', 'scheduled_due_date', 'constantly'],
      // Add other query parameters if needed
    });

    const { rows } = await pool.query(query);

    return rows;
  } catch (error) {
    console.error('An error occurred while getting the errands data from the database:', error);
    throw error;
  }
};

function formatDate(date) {
  if (!date) {
    return '';
  }

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return date.toLocaleDateString('ru-RU', options);
}

const createTable = async () => {
  const errands = await getErrandsFromDatabase();

  const tableData = [];

  doc.text(introText, doc.internal.pageSize.width / 2, 10, {
    align: 'center',
    maxWidth: 280,
  });

  errands.forEach((errand, index) => {
    const row1 = [
      { content: errand.text_errand.split('.').shift() + '.', rowSpan: 2, styles: { halign: 'center' } },
      { content: errand.text_errand.split('.').slice(1).join('.').trim(), styles: { fillColor: [222, 234, 246] } }
    ];

    const row2 = [];

    if (errand.constantly) {
      row1.push({ content: 'Ответственные - заместители генерального директора.\nСрок исполнения - постоянно', styles: { fillColor: [222, 234, 246] } });
    } else {
      row1.push({ content: `Ответственные - заместители генерального директора.\nСрок исполнения - ${formatDate(errand.scheduled_due_date)}`, styles: { fillColor: [222, 234, 246] } });
    }

    const briefReport = 'Краткий отчет для директум.';
    const detailedReport = 'Развернутый отчет.Развернутый отчет.Развернутый отчет.Развернутый отчет.Развернутый отчет.Развернутый отчет.';

    row2.push(briefReport);
    row2.push(detailedReport);

    tableData.push(row1);
    tableData.push(row2);
  });

  const tableOptions = {
    startY: 24,
    head: [headers],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'MyFont',
      fontSize: 10,
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      lineColor: [0,0,0],
    },
    headStyles: {
      halign: 'center',
      fillColor: [255, 255, 255],
      fontStyle: 'bold',
    }
  };

  doc.autoTable(tableOptions);

  doc.save('table.pdf');
};

createTable();
