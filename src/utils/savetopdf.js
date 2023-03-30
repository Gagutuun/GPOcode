const { jsPDF } = require("jspdf");

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();

doc.text("Hello world!", 10, 10);
var headers = [['ID', 'Имя', 'Фамилия']];
var data = [
  [1, 'Иван', 'Иванов'],
  [2, 'Петр', 'Петров'],
  [3, 'Анна', 'Сидорова'],
  [4, 'Мария', 'Петрова']
];
doc.table(10, 10, data, headers);

// сохраняем документ
doc.save('table.pdf');