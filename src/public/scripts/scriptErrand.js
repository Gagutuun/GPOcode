const buttons = document.querySelectorAll('.buttons button');
const activeErrands = document.querySelector('.ActiveErrands');
const archiveErrands = document.querySelector('.ArchiveErrands');
const searchInput = document.getElementById('search-input');

// Функция для фильтрации поручений по поисковому запросу
function filterErrands(searchTerm) {
  const errandLinks = document.querySelectorAll('.event-link');

  errandLinks.forEach(link => {
    const title = link.querySelector('.event-title').textContent.toLowerCase();

    if (title.includes(searchTerm.toLowerCase())) {
      link.style.display = 'block';
    } else {
      link.style.display = 'none';
    }
  });
}

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  filterErrands(searchTerm);
});

// Остальной код для кнопок и отображения поручений...

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    if (button.classList.contains('all-btn')) {
      activeErrands.style.display = 'block';
      archiveErrands.style.display = 'block';
      tableContainer.classList.remove('table-view-selected'); // Добавлено
      localStorage.setItem('selectedButton', 'all-btn');
    } else if (button.classList.contains('active-btn')) {
      activeErrands.style.display = 'block';
      archiveErrands.style.display = 'none';
      tableContainer.classList.remove('table-view-selected'); // Добавлено
      localStorage.setItem('selectedButton', 'active-btn');
    } else if (button.classList.contains('archive-btn')) {
      activeErrands.style.display = 'none';
      archiveErrands.style.display = 'block';
      tableContainer.classList.remove('table-view-selected'); // Добавлено
      localStorage.setItem('selectedButton', 'archive-btn');
    }
  });
});

const selectedButton = localStorage.getItem('selectedButton');
if (selectedButton) {
  buttons.forEach(btn => {
    if (btn.classList.contains(selectedButton)) {
      btn.click();
    }
  });
} else {
  document.querySelector('.all-btn').click();
}
