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