function confirmData() {
    const tableRows = document.querySelectorAll('.table-ReportProtocol tbody tr');
    const errandData = [];
  
    tableRows.forEach(row => {
      const id = row.getAttribute('data-id');
      const errandText = row.querySelector('.col-var-3').textContent;
      const asgnName = row.querySelector('.editable-text').textContent;
      const deadline = row.querySelector('.col-var-3').textContent;
  
      errandData.push({
        id,
        errandText,
        asgnName,
        deadline
      });
    });
  
    fetch('/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        protocolDate: document.querySelector('[name="protocolDate"]').value,
        protocolNumber: document.querySelector('[name="protocolNumber"]').value,
        errandData
      })
    })
    .then(response => {
      // Обработка ответа от сервера, если необходимо
      window.location.href = '/success-confirmation'; // Перенаправление на страницу с сообщением об успешном подтверждении
    })
    .catch(error => {
      console.error('Произошла ошибка при отправке данных на сервер', error);
      // Обработка ошибки, если необходимо
    });
  }
  