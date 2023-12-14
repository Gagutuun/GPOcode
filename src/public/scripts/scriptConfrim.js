// Определение функции addEmployee
function addEmployee(tdElement) {

  console.log(tdElement);

  // Находим контейнер для списка в пределах строки
  let selectContainer = tdElement.querySelector(".select-container");

  // Находим оригинальный список в пределах строки
  let originalSelect = selectContainer.querySelector("select");

  if (!originalSelect) {
    // Если список не найден, выводим сообщение в консоль и выходим из функции
    console.error("Оригинальный список не найден.");
    return;
  }

  // Клонируем оригинальный список
  let cloneSelect = originalSelect.cloneNode(true);

  // Генерируем новый уникальный идентификатор для клонированного списка
  const newId = `employeeId_${selectContainer.children.length}`;

  // Меняем идентификатор клонированного списка
  cloneSelect.setAttribute("name", newId);

  // Добавляем клонированный список к контейнеру перед кнопкой
  selectContainer.appendChild(cloneSelect);
  
}

// Обновленный обработчик нажатия кнопки "Отправить"
function confirmData() {
  const tableRows = document.querySelectorAll(".table-ReportProtocol tbody tr");
  const errandArray = [];

  tableRows.forEach((row) => {
    const errandText = row.querySelector("#errandText").innerText;
    const assigneeElements = row.querySelectorAll(
      "#assignees span.editable-text"
    );
    const parsedAsgnName = Array.from(assigneeElements).map(
      (assignee) => assignee.innerText
    );
    const deadline = row.querySelector("#deadline").innerText;

    // Добавляем выбранный исполнитель (из выпадающего списка)
    const selectedEmployeeId = row.querySelector(".employee-selector").value;

    errandArray.push({
      errandText,
      parsedAsgnName,
      deadline,
      selectedEmployeeId, // Добавляем выбранный исполнитель
    });
  });

  fetch("/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      errandArray,
    }),
  })
    .then((response) => {
      // Обработка ответа от сервера, если необходимо
      swal({
        title: "Успех!",
        text: "Протокол добавлен",
        icon: "success",
        button: "ОК",
      });
      window.location.href = "/errand"; // Перенаправление на страницу с сообщением об успешном подтверждении
    })
    .catch((error) => {
      console.error("Произошла ошибка при отправке данных на сервер", error);
      // Обработка ошибки, если необходимо
    });
}

document.addEventListener('DOMContentLoaded', () => {

  // Получаем все кнопки "Добавить исполнителя"
  let addEmployeeBtns = document.querySelectorAll(".addEmployee");

  let idCounter = 1;

  // Присваиваем функцию addEmployee каждой кнопке
  addEmployeeBtns.forEach(function (addEmployeeBtn) {

    addEmployeeBtn.id = `addEmployeeBtn_${idCounter++}`;

    const btnParent = addEmployeeBtn.parentElement;

    addEmployeeBtn.addEventListener("click", (event) => {
      addEmployee(btnParent);
    });

  });

  const logoBtn = document.querySelector('a.button > img.mainImg').parentElement;
  logoBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/api/removeUnparsedProtocol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    })
      .then(res => {
        window.location.href = logoBtn.href;
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
});