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
