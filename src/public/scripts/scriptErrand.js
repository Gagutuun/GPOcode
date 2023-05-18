const buttons = document.querySelectorAll('.buttons button');
const activeErrands = document.querySelector('.ActiveErrands');
const archiveErrands = document.querySelector('.ArchiveErrands');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    if (button.classList.contains('all-btn')) {
      activeErrands.style.display = 'block';
      archiveErrands.style.display = 'block';
      localStorage.setItem('selectedButton', 'all-btn');
    } else if (button.classList.contains('active-btn')) {
      activeErrands.style.display = 'block';
      archiveErrands.style.display = 'none';
      localStorage.setItem('selectedButton', 'active-btn');
    } else if (button.classList.contains('archive-btn')) {
      activeErrands.style.display = 'none';
      archiveErrands.style.display = 'block';
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