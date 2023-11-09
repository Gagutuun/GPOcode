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

// Execute the database query to get the errands data
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

    const { rows } = await pool.query(query, [11]);
    console.log(rows)
    return rows;
  } catch (error) {
    console.error('An error occurred while getting the errands data from the database:', error);
    throw error;
  }
};

// const getNameSubdivison = async () => {
//   try {
//     const query = `SELECT short_name FROM "Subdivision"`;

//     const { rows } = await pool.query(query);

//     return rows;
//   } catch (error) {
//     console.error('An error occurred while getting the errands data from the database:', error);
//     throw error;
//   }
// }

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
  // const names = await getNameSubdivison();
  const introText =
  'Перечень поручений и отчетов по протоколу производственного совещания при генеральном директоре по направлению деятельности заместителя генерального директора по управлению персоналом от ' + formatDate(errands[0].protocol_date) +'\n№ ' + errands[0].protocol_number;

  const headers = ['№ по протоколу', 'Поручение', 'Ответственный / Срок / Пояснения'];
  const tableData = [];

  // const headersEvent = ['Подразделение', 'Работы по плану', 'Отчет о выполнении'];
  // const eventTableData = [];

  doc.text(introText, doc.internal.pageSize.width / 2, 15, {
    align: 'center',
    maxWidth: 280,
  });

  const groupedErrands = {};

  errands.forEach((errand, index) => {
    const key = errand.id_errand;

    if (!groupedErrands[key]) {
      groupedErrands[key] = {
        id: errand.id_errand,
        text_errand: errand.text_errand,
        constantly: errand.constantly,
        short_report_doc: errand.short_report_doc,
        scheduled_due_date: errand.scheduled_due_date,
        actual_date: errand.actual_date,
        status: errand.status,
        id_protocol: errand.id_protocol,
        report: [],
        protocol_date: errand.protocol_date,
        file_protocol_doc: errand.file_protocol_doc,
        protocol_number: errand.protocol_number,
        general_report_file_doc: errand.general_report_file_doc,
        subdivision_short_name: [],
        surname: [],
        name: [],
        patronymic: [],
      };
    }

    groupedErrands[key].report.push(errand.report);
    groupedErrands[key].subdivision_short_name.push(errand.subdivision_short_name);
    groupedErrands[key].surname.push(errand.surname);
    groupedErrands[key].name.push(errand.name);
    groupedErrands[key].patronymic.push(errand.patronymic);
  });

  console.log(groupedErrands);

  Object.values(groupedErrands).forEach((errand, i) => {
    
    const row1 = [
      { content: errand.text_errand.split('.').shift() + '.', rowSpan: 2, styles: { halign: 'center' } },
      { content: errand.text_errand.split('.').slice(1).join('.').trim(), styles: { fillColor: [222, 234, 246] } }
    ];

    const row2 = [];

    const surnames = errand.surname;
    const names = errand.name;
    const patronymics = errand.patronymic;
  
    const formattedNames = surnames.map((surname, index) => {
      const fullName = `${surname} ${names[index][0]}.${patronymics[index][0]}.`;
      return fullName;
    });
  
    const formattedNameString = formattedNames.join(', ');
    
    if (errand.constantly) {
      row1.push({ content: 'Ответственные - '+ formattedNameString +'\nСрок исполнения - постоянно', styles: { fillColor: [222, 234, 246] } });
    } else {
      row1.push({ content: 'Ответственные - '+ formattedNameString +`\nСрок исполнения - ${formatDate(errand.scheduled_due_date)}`, styles: { fillColor: [222, 234, 246] } });
    }

    const currentDate = new Date();
    const formattedDate = "Отчет на " + currentDate.toLocaleDateString(); // Преобразовать дату в строку
    const cursivDate = { content: formattedDate, styles: { fontStyle: 'bold', textDecoration: 'underline' } };
  
    const briefReport = cursivDate.content + "\n\n" + errand.short_report_doc;
    const detailedReports = {};

    Object.values(groupedErrands).forEach((errand, i) => {
      const subdivisionShortNames = errand.subdivision_short_name;
      const reports = errand.report;
    
      subdivisionShortNames.forEach((subdivisionShortName, j) => {
        const report = reports[j];
        if (!detailedReports[subdivisionShortName]) {
          detailedReports[subdivisionShortName] = [];
        }
        detailedReports[subdivisionShortName].push(report);
      });
    });
    
    const subdivisionShortNames = errand.subdivision_short_name;
    const reports = errand.report;
    
    const formattedSubdivisionReports = subdivisionShortNames.map((subdivisionShortName, index) => {
      return `${subdivisionShortName}: ${reports[index]}`;
    });
    
    const formattedSubdivisionReportsString = formattedSubdivisionReports.join('\n\n');

    row2.push(briefReport);
    row2.push(formattedSubdivisionReportsString);

    tableData.push(row1);
    tableData.push(row2);
  });

  // names.forEach((nameSub, index) => {
  //   const row1 = [
  //     {content: nameSub.short_name},
  //   ]

  //   tableData.push(row1);
  // });

  const tableOptions = {
    startY: 35,
    head: [headers],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'MyFont',
      fontSize: 11,
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      lineColor: [0,0,0],
    },
    headStyles: {
      halign: 'center',
      fillColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 20},
      1: { cellWidth: 70},
    }
  };

  doc.autoTable(tableOptions);

  doc.save('table.pdf');

};

createTable();