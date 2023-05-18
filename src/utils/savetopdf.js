const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const CONSTANTS = require(__dirname + '/font');


const fs = require('fs');
// Создаем новый документ
const doc = new jsPDF({
  orientation: "landscape",
});

const myFont = CONSTANTS.font  // load the *.ttf font file as binary string

// add the font to jsPDF
doc.addFileToVFS("MyFont.ttf", myFont);
doc.addFont("MyFont.ttf", "MyFont", "normal");
doc.setFont("MyFont");

// определение заголовков столбцов таблицы
const headers = [
  '№ по протоколу',
  'Поручение',
  'Ответственный / Срок / Пояснения'
];

// определение данных таблицы
const data = [
  [
    {rowSpan: 2, content: '1.'},
    'Поручение 1',
    'Ответственные - заместители генерального директора, Исайкин А.Г. Срок исполнения - постоянно'
  ],
  [
    'Отчет на 15.11.2021 (дата отчета) Краткий отчет по поручению 1 для Директум',
    'Развернутые ответы от подразделений по поручениям. Могут быть разные исполнители в разных пунктах. От 1 до 10 исполнителей. ООТиЗ: отчет ОКиТО: отчет КИ: отчет СК: отчет МС: отчет ОСР: отчет'
  ],
  [
    {rowSpan: 2, content: '2.'},
    'Поручение 2',
    'Ответственные - Бакало.'
  ],
  [
    'Отчет на 15.11.2021',
    'Развернутые отчеты от подразделений по поручениям.'
  ]
];



const createTable = (headers, data) => {
// определение параметров таблицы
const tableOptions = {
  startY: 10,
  head: [headers],
  body: data,
  theme: 'grid',
  styles: {
    font: "MyFont",
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak', // добавляем этот стиль для переноса текста
    cellWidth: 'auto',
    fontSize: 14,
    textColor: [0,0,0],
    tableLineColor: [0,0,0]
  },
  headStyles: {
    fillColor: [255,255,255]
  },
  bodyStyles: {

  },
  didDrawCell: (data) => {
    // отрисовка линий между заголовками и данными таблицы
    if (data.row.index === 0) {
      doc.setLineWidth(0,5);
      doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
    }
  }
};
// создание таблицы с помощью auto-table
doc.autoTable(tableOptions);
};

createTable(headers, data);

// сохранение документа
doc.save('table.pdf');