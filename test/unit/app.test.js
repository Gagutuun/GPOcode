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