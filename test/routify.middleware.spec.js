/* global describe context it beforeEach */

const expect = require('chai').expect
const router = require('../routify.js')

describe('routify middleware', () => {
  beforeEach(() => {
    router.middleware = []
  })

  it('should have no default middleware', () => {
    expect(router.middleware.length).to.equal(0)
  })

  context('Use', () => {
    const noOpMiddleware = () => {}

    it('should add single middleware', () => {
      expect(() => {
        router.use(noOpMiddleware)
      }).to.not.throw(TypeError)

      expect(router.middleware.length).to.equal(1)
      expect(router.middleware[0]).to.equal(noOpMiddleware)
    })

    it('should add array of middleware', () => {
      expect(() => {
        router.use([noOpMiddleware, noOpMiddleware])
      }).to.not.throw(TypeError)

      expect(router.middleware.length).to.equal(2)
      expect(router.middleware[0]).to.equal(noOpMiddleware)
      expect(router.middleware[1]).to.equal(noOpMiddleware)
    })

    it('should throw when middleware is not a function or array', () => {
      expect(() => router.use('')).to.throw(TypeError)
      expect(router.middleware.length).to.equal(0)
    })
  })
})
