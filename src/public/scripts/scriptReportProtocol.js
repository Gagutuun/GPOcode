const expandButtons = document.querySelectorAll('button.expand-button');
const formProtocolBtns = document.querySelectorAll('button.formProtocol');
const buttons = document.querySelectorAll('.buttons button');
const activeProtocols = document.querySelector('.ActiveProtocols');
const archiveProtocols = document.querySelector('.ArchiveProtocols');
const tableContainer = document.querySelector('.table-container');
const searchInput = document.getElementById('search-input'); // Получение элемента по его ID

// Функция для фильтрации протоколов по поисковому запросу
function filterReports(searchTerm) {
  const reportLinks = document.querySelectorAll('.event-link-ReportProtocol');

  reportLinks.forEach(link => {
    const date = link.querySelector('.date-ReportProtocol').textContent.toLowerCase();
    const number = link.querySelector('.number-ReportProtocol').textContent.toLowerCase();

    if (date.includes(searchTerm.toLowerCase()) | number.includes(searchTerm.toLowerCase())) {
      link.style.display = 'block';
    } else {
      link.style.display = 'none';
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim(); // Получение введенного текста из поля поиска
    filterReports(searchTerm);
  });
}

const storedSearchTerm = localStorage.getItem('searchTerm');
if (storedSearchTerm) {
  searchInput.value = storedSearchTerm;
  filterReports(storedSearchTerm);
}

if (buttons) {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      if (button.classList.contains('active-btn')) {
        activeProtocols.style.display = 'block';
        archiveProtocols.style.display = 'none';
        tableContainer.classList.remove('table-view-selected'); // Добавлено
        localStorage.setItem('selectedButton', 'active-btn');
      } else if (button.classList.contains('archive-btn')) {
        activeProtocols.style.display = 'none';
        archiveProtocols.style.display = 'block';
        tableContainer.classList.remove('table-view-selected'); // Добавлено
        localStorage.setItem('selectedButton', 'archive-btn');
      }
    });
  });
}

const activeBtnElement = document.querySelector('.active-btn');
const selectedButton = localStorage.getItem('selectedButton');
if (selectedButton) {
  buttons.forEach(btn => {
    if (btn.classList.contains(selectedButton)) {
      btn.click();
    }
  });
} else if (activeBtnElement) {
    document.querySelector('.active-btn').click();
}

if (expandButtons) {
  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr'); // Находим ближайшую строку
      row.classList.toggle('expanded'); // Переключаем класс expanded

      // Изменяем текст кнопки в зависимости от состояния строки
      if (row.classList.contains('expanded')) {
        button.textContent = 'ᐱ'; // Если строка развернута, изменяем текст на "ᐯ"
      } else {
        button.textContent = 'ᐯ'; // Если строка свернута, изменяем текст на "ᐱ"
      }

      // Сохраняем состояние строк в локальном хранилище
      const expandedRows = Array.from(document.querySelectorAll('tr.expanded')).map(row => row.rowIndex);
      localStorage.setItem('expandedRows', JSON.stringify(expandedRows));
    });
  });
}

// Получаем ссылку на элементы
const editableText = document.querySelector('.editable-text');
const editButton = document.querySelectorAll('.edit-errand-report-change');

// Флаг для отслеживания режима редактирования
let isEditing = false;

// Функция для включения/выключения режима редактирования
function toggleEdit() {
  if (isEditing) {
    // В режиме редактирования - сохраняем изменения
    editableText.contentEditable = false;
    editButton.value = 'Изменить';
    // Здесь можно добавить код для сохранения изменений на сервере
  } else {
    // Включаем режим редактирования
    editableText.contentEditable = true;
    editButton.value = 'Сохранить';
    // Мигание рамкой
    flashBorder();
  }
  // Инвертируем флаг
  isEditing = !isEditing;
}

editButton.forEach(element => {
  element.addEventListener('click', toggleEdit);
});// Добавляем обработчик события на клик по кнопке "Изменить"

// Функция для мигания рамкой
function flashBorder() {
  let count = 0;
  const interval = setInterval(() => {
    if (count >= 3) {
      clearInterval(interval); // Остановить мигание после 2 раз
      editableText.style.border = 'none'; // Убрать рамку после мигания
    } else {
      editableText.style.border = '2px solid grey'; // Установить рамку
      setTimeout(() => {
        editableText.style.border = 'none'; // Убрать рамку через некоторое время
      }, 500);
      count++;
    }
  }, 1000); // Интервал мигания: 1 секунда
}

document.querySelector('.formProtocol').addEventListener('click', async function () {
  const activeErrands = Array.from(document.querySelectorAll('.col-var-2')).filter(td => td.textContent.trim() === 'Активно');
  
  if (activeErrands.length > 0) {
    // Есть активные поручения
    const shouldContinue = await swal({
      title: "Предупреждение",
      text: "Есть активные задачи. Продолжить формирование отчета?",
      icon: "warning",
      buttons: ["Отмена", "Продолжить"],
      dangerMode: true,
    });

    if (!shouldContinue) {
      // Пользователь отменил операцию
      return;
    }
  }

  // Assuming you have data to send, modify this as needed
  const dataToSend = {
    // Add your data properties here
    exampleProperty: 'exampleValue',
    // ...
  };

  // Extracting protocolNumber from the current URL
  const protocolNumber = window.location.pathname.match(/\d+/)[0];

  // Sending data to the server using plain JavaScript AJAX
  const xhr = new XMLHttpRequest();

  // Define the type, URL, and whether the request should be asynchronous
  xhr.open('POST', `/reportProtocol/${protocolNumber}/generate-report`, true);

  // Set the request header to indicate the content type
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Define the callback functions for success and error
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Success response
      const reportFilePath = JSON.parse(xhr.responseText).reportFilePath;

      swal({
        title: "Success!",
        text: "Report generated",
        icon: "success",
        buttons: {
          download: {
            text: "Download Report",
            value: "download",
          },
          cancel: "Close",
        },
      }).then((value) => {
        if (value === "download") {
          // Trigger file download
          window.location.href = reportFilePath;
        }
      });
    } else {
      // Error response
      console.error('Error generating report:', xhr.statusText);
    }
  };

  // Handle network errors
  xhr.onerror = function () {
    console.error('Network error occurred while sending the request.');
  };

  // Convert the data to JSON and send the request
  xhr.send(JSON.stringify(dataToSend));
});

// OneReportProtocol.js

document.querySelector('.edit-button-errand').addEventListener('click', async function () {
  const protocolNumber = window.location.pathname.match(/\d+/)[0];
  const downloadUrl = `/download-report/${protocolNumber}`;

  try {
    const response = await fetch(downloadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const blob = await response.blob();

      // Создайте ссылку для скачивания
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Отчет_по_протоколу_${protocolNumber}.pdf`;

      // Добавьте ссылку в DOM и выполните скачивание
      document.body.appendChild(link);
      link.click();

      // Удалите ссылку из DOM
      document.body.removeChild(link);
    } else {
      console.error('Failed to download report:', response.statusText);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
});

