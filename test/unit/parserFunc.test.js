const assert = require('assert');
const parserFunc = require('../../src/utils/parser'); //replace with actual file path

describe('parserFunc', () => {
  it('should return an array of parsed data', () => {
    const testData = `
    Some text
    РЕШИЛИ: 
      Разработать новую программу. Ответственный - Бакало. срок исполнения – 16.11.2022. 
      Разработать новую страницу на сайте. Ответственный - Иванов. срок исполнения – 15.05.2021. 
      Решения предыдущих совещаний
      
      Другой текст`;
    const expected = [["Разработать новую программу", "Бакало", "16.11.2022"], ["Разработать новую страницу на сайте", "Иванов", "15.05.2021"]];
    const result = parserFunc(testData);
    assert.deepStrictEqual(result, expected);
  });
  it('should return an empty array if no data is provided', () => {
    const result = parserFunc("");
    assert.deepStrictEqual(result, []);
  });
  //Add more test cases as needed
});