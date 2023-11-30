// Выбор активного элемента списка
const map = {
    'upload': 'download-protocol-id',
    'uploadProtocol': 'download-protocol-id',
    'errand': 'errand-id',
    'reportProtocol': 'report-protocol-id',
    'feedback': 'feedback-id'
};
window.addEventListener('load', () => {
    document.getElementById(map[window.location.href.substring(window.location.href.lastIndexOf('/') + 1)]).classList.add('active');
})

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
