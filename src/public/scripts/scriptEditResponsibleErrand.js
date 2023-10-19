// Находим все кнопки "Изменить" и назначаем им обработчик события click
const editButtons = document.querySelectorAll('.edit-errand-report-change');
editButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('tr');
    const editableText = row.querySelector('.editable-text');

    editableText.contentEditable = !editableText.isContentEditable;

    button.value = editableText.isContentEditable ? "Сохранить" : "Изменить";
    
    if (editableText.isContentEditable) {
      flashBorder(editableText);
    }
  });
});

// Функция для подсветки элемента
function flashBorder(editableText) {
  let count = 0;
  const interval = setInterval(() => {
    if (count >= 3) {
      clearInterval(interval);
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
