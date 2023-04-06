//IMPORTS
const parseData = require('../../src/utils/parser');

//TEST SUITE
describe('parseData', () => {
    const UPLINE = "РЕШИЛИ: ";
    const TIMETOEND = "Срок исполнения";
    const LASTRESH = "Решения предыдущих совещаний";
    const OTVETV = "Ответственн";
    const ZAMS = "заместители генерального директора";
    const DIRECTOR = "Бакало";

    // TEST CASE ONE
    it('should parse data for valid input', () => {
        const input = 'Поручение 1. Ответственные – заместители генерального директора, Иванов И.И.. Срок исполнения – постоянно.';
        const expectedOutput = [["Поручение 1.", "заместители генерального директора", "Иванов И.И..", "постоянно."]];
        const output = parseData(input);
        expect(output).toEqual(expectedOutput);
    });

    // TEST CASE TWO
    it('should return empty array for empty input', () => {
        const input = '';
        const expectedOutput = [];
        const output = parseData(input);
        expect(output).toEqual(expectedOutput);
    });
});

// Данный код содержит набор модульных тестов (test suite) для функции parseData, принимающей строку и возвращающей массив данных, извлеченных из этой строки. 

// Тестовый случай "should parse data for valid input" (должен разбирать данные для корректного ввода) проверяет, что функция parseData правильно извлекает данные, когда на вход подается строка с корректными данными. Он устанавливает входные данные, ожидаемые результаты, вызывает функцию parseData с входными данными и сравнивает возвращаемые данные с ожидаемыми результатами с помощью функции expect из библиотеки Jest.

// Второй тестовый случай "should return empty array for empty input" (должен возвращать пустой массив для пустого ввода) проверяет, что если функции parseData не передается входная строка, она возвращает пустой массив. 

// Оба тестовых случая используют функции expect и toEqual, чтобы проверить, что ожидаемые результаты совпадают с фактическими результатами.