const buttons = document.querySelectorAll('.expand-button');
const checkboxes = document.querySelectorAll('.checkbox-order-selection');

// Обходим все чекбоксы и устанавливаем их состояние в соответствии с сохраненными данными
checkboxes.forEach(checkbox => {
  const rowIndex = Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'));
  const storedCheckbox = localStorage.getItem(`checkbox${rowIndex}`);
  if (storedCheckbox) {
    checkbox.checked = storedCheckbox === 'true';
  }
  
  // Добавляем обработчик события изменения состояния чекбокса
  checkbox.addEventListener('change', () => {
    const rowIndex = Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'));
    localStorage.setItem(`checkbox${rowIndex}`, checkbox.checked);
  });
});

//Обработка нажатия на кнопку "Сверхнуть/Развернуть"
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const row = button.closest('tr');
    row.classList.toggle('expanded');

    // Получаем индекс строки
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    let storedButton = localStorage.getItem('expandedButtons');
    let expandedButtons = storedButton ? JSON.parse(storedButton) : [];

    // Если строка уже сохранена, удаляем ее из массива
    if (expandedButtons.includes(rowIndex)) {
      const index = expandedButtons.indexOf(rowIndex);
      expandedButtons.splice(index, 1);
      button.textContent = 'ᐯ';
    }
    else {
      expandedButtons.push(rowIndex);
      button.textContent = 'ᐱ';
    }
    localStorage.setItem('expandedButtons', JSON.stringify(expandedButtons));
  });

  const rowIndex = Array.from(button.closest('tr').parentNode.children).indexOf(button.closest('tr'));
  let storedButton = localStorage.getItem('expandedButtons');
  let expandedButtons = storedButton ? JSON.parse(storedButton) : [];
  if (expandedButtons.includes(rowIndex)) {
    button.closest('tr').classList.add('expanded');
    button.textContent = 'ᐱ';
  }
});

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
