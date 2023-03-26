const { createLogger, transports } = require('winston');

// Создаем новый логгер
const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'logs/app.log', // Путь к файлу, в который будут записываться логи
      level: 'info', // Уровень записываемых логов
      format: combine(
        label({ label: 'app' }),
        timestamp(),
        myFormat
      )
    })
  ]
});

// Экспортируем наш логгер для использования в других частях приложения
module.exports = logger;

// Пример использования
// const logger = require('./logger.js');

// Записываем сообщение в лог файл
// logger.info('Hello from logger.js');