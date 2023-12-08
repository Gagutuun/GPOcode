function toggleErrandStatus(element) {
	var statusErrand = element.closest('.statusErrand');
	var isCompleted = statusErrand.classList.contains('this-errand-has-been-completed');
	let errandStatusString;

	if (isCompleted) {
		// Если задание завершено, вернуть в исходное состояние
		statusErrand.classList.remove('this-errand-has-been-completed');
		statusErrand.querySelector('.edit-icon-errand').src = "../images/oneErrand/edit_icon1.svg";
		statusErrand.querySelector('.edit-icon-errand').alt = "edit icon";
		statusErrand.querySelector('.edit-icon-errand').title = "Edit";
		statusErrand.querySelector('.status-text').textContent = 'Активно';
		errandStatusString = 'Активно';
	} else {
		// Если задание не завершено, установить класс и изменить текст
		statusErrand.classList.add('this-errand-has-been-completed');
		statusErrand.querySelector('.edit-icon-errand').src = "../images/oneErrand/edit_icon2.svg";
		statusErrand.querySelector('.edit-icon-errand').alt = "completed icon";
		statusErrand.querySelector('.edit-icon-errand').title = "Completed";
		statusErrand.querySelector('.status-text').textContent = 'Завершено';
		errandStatusString = 'Завершено';
	}

	fetch('/api/changeErrandStatus', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			errandID: parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1)),
			status: errandStatusString,
			calledFrom: window.location.href
		})
	})
		.then(response => {
			if (!response.ok) {
				console.error('Ошибка при изменении статуса поручения:', response.statusText);
			}
			return;
		})
		.catch(error => {
			console.error('Ошибка при выполнении POST-запроса: ', error);
		});

}

function openModal() {
	document.querySelector('.modal-overlay').style.display = 'flex';
}

function closeModal() {
	document.querySelector('.modal-overlay').style.display = 'none';
}

