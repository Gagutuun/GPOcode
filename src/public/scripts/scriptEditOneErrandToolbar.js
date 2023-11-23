const textarea = document.getElementById('editorTextarea');
const saveButton = document.querySelector('.edit-errand-report');

// Получение id поручения из URL
const currentUrl = window.location.href;
const errandId = currentUrl.split('/').pop();

// Обработчик события для сохранения текста в базе данных
saveButton.addEventListener('click', async () => {
  const text = textarea.value;
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/errand\/(\d+)\/edit/);
  const errandId = match ? match[1] : null;
  
  console.log(`ErrandId = ${errandId}`);
  try {
    const response = await fetch(`/errand/${errandId}/saveReport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ short_report_doc: text }),
    });

    if (response.ok) {
      swal({
        title: "Успех!",
        text: "Текст сохранен в базе данных",
        icon: "success",
        button: "ОК",
      });
    } else {
      swal ( "Упс!" ,  "Что-то пошло не так..." ,  "error" )
    }
  } catch (error) {
    console.error('Ошибка при выполнении запроса на сохранение текста:', error);
  }
});

// Остальной код для чтения/записи в localStorage
// ...

// textarea.addEventListener('input', () => {
//     const text = textarea.value;
//     localStorage.setItem('editorText', text);
// });

// const savedText = localStorage.getItem('editorText');
// if (savedText) {
//     textarea.value = savedText;
// }
