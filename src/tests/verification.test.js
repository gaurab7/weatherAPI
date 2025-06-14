import { verificationMiddleware } from '../middleware/cityVerify.js'
import { jest } from '@jest/globals'

describe('Request Verification', () => {
    it('should call next if the city exists', async () => {
        const req = { query: { q: 'London' } } //city = req.query.q
        const res = {}
        //jest.fn() can be used to track calls
        //here it tracks if next was called.if we set const call = jest.fn() and passed that to middleware it would stlll track next call would be the var we pass for next
        const next = jest.fn()
        await verificationMiddleware(req, res, next)
        expect(next).toHaveBeenCalled()
    })

    it('should return 400 if the city is invalid', async () => {
        const req = { query: { q : 'invsif204050'} }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const next = jest.fn()
        await verificationMiddleware(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid city' })
    })
})