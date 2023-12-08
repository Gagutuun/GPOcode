// Обновленный обработчик нажатия кнопки "Отправить"
function confirmData() {
  const tableRows = document.querySelectorAll('.table-ReportProtocol tbody tr');
  const errandArray = [];

  tableRows.forEach(row => {
    const errandText = row.querySelector('#errandText').innerText;
    const assigneeElements = row.querySelectorAll('#assignees span.editable-text');
    const parsedAsgnName = Array.from(assigneeElements).map(assignee => assignee.innerText);
    const deadline = row.querySelector('#deadline').innerText;

    // Добавляем выбранный исполнитель (из выпадающего списка)
    const selectedEmployeeId = row.querySelector('.employee-selector').value;

    errandArray.push({
      errandText,
      parsedAsgnName,
      deadline,
      selectedEmployeeId // Добавляем выбранный исполнитель
    });
  });

  fetch('/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      errandArray
    })
  })
    .then(response => {
      // Обработка ответа от сервера, если необходимо
      swal({
        title: "Успех!",
        text: "Протокол добавлен",
        icon: "success",
        button: "ОК"
      });
      window.location.href = '/errand'; // Перенаправление на страницу с сообщением об успешном подтверждении  
    })
    .catch(error => {
      console.error('Произошла ошибка при отправке данных на сервер', error);
      // Обработка ошибки, если необходимо
    });
}

console.log("[DEBUG] прям перед обработкой");

document.addEventListener('DOMContentLoaded', function () {

  console.log("[DEBUG] блять я делаюсь");

  // Находим кнопку "Добавить исполнителя"
  var addEmployeeBtn = document.getElementById('addEmployeeBtn');

  // Добавляем обработчик событий для клика
  addEmployeeBtn.addEventListener('click', function () {
    // Находим контейнер для списка
    var selectContainer = document.querySelector('.select-container');

    // Находим оригинальный список
    var originalSelect = selectContainer.querySelector('select');

    if (!originalSelect) {
      // Если список не найден, выводим сообщение в консоль и выходим из функции
      console.error('Оригинальный список не найден.');
      return;
    }

    // Клонируем оригинальный список
    var cloneSelect = originalSelect.cloneNode(true);

    // Генерируем новый уникальный идентификатор для клонированного списка
    var newId = 'employeeId_' + selectContainer.children.length;

    // Меняем идентификатор клонированного списка
    cloneSelect.setAttribute('name', newId);

    // Добавляем клонированный список к контейнеру перед кнопкой
    selectContainer.insertBefore(cloneSelect, addEmployeeBtn);
  });

  const logoBtn = document.querySelector('a.button > img.mainImg').parentElement;
  console.log(`[DEBUG] logoBtn = ${logoBtn} of ${logoBtn.tagName}`);
  logoBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("[DEBUG] блять я тоже");
    fetch('/api/removeUnparsedProtocol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    })
      .then(res => {
        console.log(`[DEBUG] POST ${res.status} - ${res.text()}`);
        window.location.href = logoBtn.href;
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
});

console.log("[DEBUG] прям после обработки");
