const expandButtons = document.querySelectorAll('button.expand-button');
const checkboxes = document.querySelectorAll('.checkbox-order-selection');
const buttons = document.querySelectorAll('.buttons button');
const activeProtocols = document.querySelector('.ActiveProtocols');
const archiveProtocols = document.querySelector('.ArchiveProtocols');
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

if (checkboxes) {
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Логика для сохранения состояния чекбоксов
    });
  });

  checkboxes.forEach(checkbox => {
    const rowIndex = Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'));
    const storedCheckbox = localStorage.getItem(`checkbox${rowIndex}`);
    if (storedCheckbox) {
      checkbox.checked = storedCheckbox === 'true';
    }
  });
  
}

//Логика для сохранения и восстановления состояния чекбоксов и развернутых строк при загрузке страницы

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
// Восстанавливаем состояние строк при загрузке страницы
const storedExpandedRows = localStorage.getItem('expandedRows');
if (storedExpandedRows) {
  const expandedRows = JSON.parse(storedExpandedRows);
  expandedRows.forEach(rowIndex => {
    const row = document.querySelectorAll('tr')[rowIndex];
    if (row) {
      row.classList.add('expanded');
      const expandButton = row.querySelector('button.expand-button');
      if (expandButton) {
        expandButton.textContent = 'ᐯ'; // Изменяем текст кнопки, если строка развернута
      }
    }
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
