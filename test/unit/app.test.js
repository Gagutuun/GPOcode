const request = require('supertest')
const createError = require('http-errors')
const express = require('express')
const app = require('../../app')

describe('app', () => {
  it('should respond with a 404 error for a non-existent route', async () => {
    const response = await request(app).get('/invalid-route')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(createError(404))
  })

  it('should render the error page for any error', async () => {
    const response = await request(app).get('/error')
    expect(response.status).toBe(500)
    expect(response.text).toContain('Error')
  })
})
