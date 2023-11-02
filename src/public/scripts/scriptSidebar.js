// const bgBtn = document.querySelectorAll("li");

// const selectedLi = localStorage.getItem("selectedLi");
// if (selectedLi) {
//     bgBtn.forEach((li) => {
//         if (li.classList.contains(selectedLi)) {
//             li.classList.add("active");
//         } else {
//             li.classList.remove("active");
//         }
//     });
// }

// bgBtn.forEach((link) => {
//     link.addEventListener("click", function (event) {
//         bgBtn.forEach((li) => {
//             li.classList.remove("active");
//         });
//         this.classList.add("active");

//         localStorage.setItem("selectedLi", this.classList[0]);
//     });
// });



// // Функция для обработки нажатий на элементы списка
// function handleItemClick(itemId) {
//     const clickedElement = document.getElementById(itemId);

//     // Проверяем, активен ли уже этот элемент
//     if (!clickedElement.classList.contains('active')) {
//         // Снимаем активное состояние с других элементов
//         const listItems = document.querySelectorAll('li');
//         listItems.forEach(item => {
//             item.classList.remove('active');
//             localStorage.removeItem(item.id);
//         });

//         // Добавляем активное состояние только на выбранный элемент
//         clickedElement.classList.add('active');
//         localStorage.setItem(itemId, 'active');
//     }
// }

// // Добавляем обработчик события для каждого элемента списка
// document.getElementById('download-protocol-id').addEventListener('click', () => handleItemClick('download-protocol-id'));
// document.getElementById('errand-id').addEventListener('click', () => handleItemClick('errand-id'));
// document.getElementById('report-protocol-id').addEventListener('click', () => handleItemClick('report-protocol-id'));
// document.getElementById('feedback-id').addEventListener('click', () => handleItemClick('feedback-id'));
// document.getElementById('exit-id').addEventListener('click', () => handleItemClick('exit-id'));
// document.getElementById('home').addEventListener('click', () => handleItemClick('home'));

// // Проверяем, есть ли информация в localStorage о выбранном элементе и применяем "active"
// if (localStorage.getItem('download-protocol-id') === 'active') {
//     document.getElementById('download-protocol-id').classList.add('active');
// }
// if (localStorage.getItem('errand-id') === 'active') {
//     document.getElementById('errand-id').classList.add('active');
// }
// if (localStorage.getItem('report-protocol-id') === 'active') {
//     document.getElementById('report-protocol-id').classList.add('active');
// }
// if (localStorage.getItem('feedback-id') === 'active') {
//     document.getElementById('feedback-id').classList.add('active');
// }



// Функция для обработки нажатий на элементы списка
function handleItemClick(itemId) {
    const clickedElement = document.getElementById(itemId);

    // Проверяем, активен ли уже этот элемент
    if (!clickedElement.classList.contains('active')) {
        // Снимаем активное состояние с других элементов
        const listItems = document.querySelectorAll('li');
        listItems.forEach(item => {
            item.classList.remove('active');
            localStorage.removeItem(item.id);
        });
        
        clickedElement.classList.add('active');
        localStorage.setItem(itemId, 'active');

        setTimeout(() => {
            clickedElement.classList.remove('active');
        }, 10000);
    }
}

// Добавляем обработчик события для каждого элемента списка
document.getElementById('download-protocol-id').addEventListener('click', () => handleItemClick('download-protocol-id'));
document.getElementById('errand-id').addEventListener('click', () => handleItemClick('errand-id'));
document.getElementById('report-protocol-id').addEventListener('click', () => handleItemClick('report-protocol-id'));
document.getElementById('feedback-id').addEventListener('click', () => handleItemClick('feedback-id'));
document.getElementById('exit-id').addEventListener('click', () => handleItemClick('exit-id'));
document.getElementById('home').addEventListener('click', () => handleItemClick('home'));

// Проверяем, есть ли информация в localStorage о выбранном элементе и применяем "active"
if (localStorage.getItem('download-protocol-id') === 'active') {
    document.getElementById('download-protocol-id').classList.add('active');
}
if (localStorage.getItem('errand-id') === 'active') {
    document.getElementById('errand-id').classList.add('active');
}
if (localStorage.getItem('report-protocol-id') === 'active') {
    document.getElementById('report-protocol-id').classList.add('active');
}
if (localStorage.getItem('feedback-id') === 'active') {
    document.getElementById('feedback-id').classList.add('active');
}




// Контекстное меню уведомлений
var bellButton = document.getElementById("bell-btn");
var contextMenu = document.getElementById("context-menu");

// Функция для открытия контекстного меню
function openContextMenu() {
    contextMenu.style.display = "block";
    setTimeout(function () {
        contextMenu.style.opacity = "1";
        contextMenu.style.transform = "scaleY(1)";
    }, 0);
}

// Функция для закрытия контекстного меню
function closeContextMenu() {
    contextMenu.style.opacity = "0";
    contextMenu.style.transform = "scaleY(0)";
    setTimeout(function () {
        contextMenu.style.display = "none";
    }, 300); // Время анимации в миллисекундах (0.3 секунды)
}

// Добавляем обработчик события "click" к элементу
bellButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Предотвращаем всплытие события

    if (contextMenu.style.display === "block") {
        closeContextMenu();
    } else {
        openContextMenu();
    }
});

// Добавляем обработчик события "click" для всего документа
document.addEventListener("click", function (event) {
    // Проверяем, был ли клик совершен внутри контекстного меню
    if (!contextMenu.contains(event.target)) {
        // Если клик был совершен вне контекстного меню, то скрываем его
        closeContextMenu();
    }
});

// Добавляем обработчик события "blur" для окна браузера
window.addEventListener("blur", function () {
    // Скрываем контекстное меню при потере фокуса окна (переключении вкладок)
    closeContextMenu();
});

// Добавляем обработчик события "resize" и "scroll" для окна браузера
window.addEventListener("resize", function () {
    // Скрываем контекстное меню при изменении размеров окна
    closeContextMenu();
});

window.addEventListener("scroll", function () {
    // Скрываем контекстное меню при перемещении окна
    closeContextMenu();
});
