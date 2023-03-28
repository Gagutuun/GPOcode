const request = require('supertest');
const app = require('../../app');

describe('Routes', () => {
  it('should respond with 404 for invalid routes', async () => {
    await request(app).get('/invalid-route').expect(404);
  });

  describe('GET /', () => {
    it('should respond with 200', async () => {
      await request(app).get('/').expect(200);
    });

    it('should return HTML', async () => {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('GET /users', () => {
    it('should respond with 200', async () => {
      await request(app).get('/users').expect(200);
    });
  });

  describe('POST /upload', () => {
    it('should respond with 400 if no file is uploaded', async () => {
      const response = await request(app).post('/upload').expect(400);
      expect(response.text).toEqual('No files were uploaded.');
    });

    it('should respond with 200 if a file is uploaded', async () => {
      const response = await request(app)
        .post('/upload')
        .attach('sampleFile', '../../protokol.docx')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/html/);
      expect(response.text).toContain('<title>GPO_test</title>');
    });
  });
});

// Данный код тестирует различные маршруты серверного приложения с использованием supertest библиотеки. 

// - Проверяет наличие обработки запросов по недопустимому маршруту с ожидаемым ответом 404. 
// - Проверяет наличие ответа по корневому маршруту с ожидаемым кодом 200 и содержание ответа является HTML.
// - Проверяет наличие ответа по маршруту /users с ожидаемым кодом 200.
// - Проверяет обработку загрузок файлов на маршруте /upload. Если файл не загружен, сервер должен вернуть ошибку 400, а если загружен, сервер должен вернуть 200 и содержать HTML.

// Общее использование протокола HTTP для проверки кодов состояний и типов ответов от сервера с помощью supertest библиотеки.