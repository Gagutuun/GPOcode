// const buttons = document.querySelectorAll('.expand-button');
// const checkboxes = document.querySelectorAll('.checkbox-order-selection');
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

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim(); // Получение введенного текста из поля поиска
  filterReports(searchTerm);
});

// buttons.forEach(button => {
//   button.addEventListener('click', () => {
//     buttons.forEach(btn => btn.classList.remove('active'));
//     button.classList.add('active');
//     if (button.classList.contains('expand-btn')) {
//       // Логика для отображения/скрытия развернутых протоколов
//     }
//   });
// });

// checkboxes.forEach(checkbox => {
//   checkbox.addEventListener('change', () => {
//     // Логика для сохранения состояния чекбоксов
//   });
// });

// // Логика для сохранения и восстановления состояния чекбоксов и развернутых строк при загрузке страницы

// const storedSearchTerm = localStorage.getItem('searchTerm');
// if (storedSearchTerm) {
//   searchInput.value = storedSearchTerm;
//   filterReports(storedSearchTerm);
// }

// buttons.forEach(button => {
//   const rowIndex = Array.from(button.closest('tr').parentNode.children).indexOf(button.closest('tr'));
//   let storedButton = localStorage.getItem('expandedButtons');
//   let expandedButtons = storedButton ? JSON.parse(storedButton) : [];
//   if (expandedButtons.includes(rowIndex)) {
//     button.closest('tr').classList.add('expanded');
//     button.textContent = 'ᐱ';
//   }
// });

// checkboxes.forEach(checkbox => {
//   const rowIndex = Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'));
//   const storedCheckbox = localStorage.getItem(`checkbox${rowIndex}`);
//   if (storedCheckbox) {
//     checkbox.checked = storedCheckbox === 'true';
//   }
// });
