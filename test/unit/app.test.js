// Comment for root path test suite
describe('Test the root path', () => {
  // Test if GET request to root path returns 200 status code
  test('It should response 200 status code for GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  // Test if POST request to root path returns 404 status code
  test('It should response 404 status code for POST method', async () => {
    const response = await request(app).post('/');
    expect(response.statusCode).toBe(404);
  });
});

// Comment for users path test suite
describe('Test the users path', () => {
  // Test if GET request to users path returns 200 status code
  test('It should response with 200 status code', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
  });
});

// Comment for upload path test suite
describe('Test the upload path', () => {
  // Test if POST request with file attachment to upload path returns 200 status code
  test('It should response with 200 status code', async () => {
    const response = await request(app).post('/upload').attach('sampleFile', './example.docx');
    expect(response.statusCode).toBe(200);
  });
});

// Comment for error handling test suite
describe('Test the error handling', () => {
  // Test if GET request to non-existing path returns 404 status code
  test('It should response with 404 status code when path does not exist', async () => {
    const response = await request(app).get('/not-exist');
    expect(response.statusCode).toBe(404);
  });

  // Test if POST request with incorrect file attachment key to upload path returns 500 status code
  test('It should response with 500 status code when internal server error happens', async () => {
    const response = await request(app).post('/upload').attach('wrongKey', './example.docx');
    expect(response.statusCode).toBe(500);
  });
});