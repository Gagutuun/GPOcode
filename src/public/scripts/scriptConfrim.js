
function confirmData() {
    const tableRows = document.querySelectorAll('.table-ReportProtocol tbody tr');
    const errandArray = [];
    console.log(tableRows);
    tableRows.forEach(row => {
    console.log(`[DEBUG] иду по циклу формируя массив объектов`)
          // Получение текста из ячейки с id 'errandText' в первой строке
    const errandText = row.querySelector('#errandText').innerText;

    // Получение текста из ячейки с id 'assignees' в первой строке
    const assigneeElements = row.querySelector('#assignees span.editable-text');
    const asgnName = assigneeElements.innerText;

    console.log(`assigneeElements = ${assigneeElements}`);

    const parsedAsgnName = asgnName.split(", ");
    
    // Array.from(assigneeElements).map(element => element.textContent);

    // Получение текста из ячейки с id 'deadline' в первой строке
    const deadline = row.querySelector('#deadline').innerText;
  
      errandArray.push({
        errandText,
        parsedAsgnName,
        deadline
      });
    });
    console.log(`DEBUG(scriptConfirm.js) ${errandArray}`);
    

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
      //window.location.href = '/errand'; // Перенаправление на страницу с сообщением об успешном подтверждении
      alert('успех');
    })
    .catch(error => {
      console.error('Произошла ошибка при отправке данных на сервер', error);
      alert('hui');
      // Обработка ошибки, если необходимо
    });
  }
  