import request from 'supertest'
import app from '../server.js'

describe('Rate Limiter', () => {
  it('should block requests after hitting the limit', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get('/weather?q=London')
      expect(res.status).toBe(200)
    }

    const blockedRes = await request(app).get('/weather?q=London')
    expect(blockedRes.status).toBe(429)
    expect(blockedRes.text).toMatch(/You have reached the request limits. Please try again later/)
  })

}) 