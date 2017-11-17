/* global describe context it beforeEach */

const expect = require('chai').expect
const router = require('../routify.js')

describe('routify middleware', () => {
  let callstack = []
  const nextHandler = () => callstack.push('nextHandler')
  const syncHandler = (req, res, next) => callstack.push('syncHandler')
  const asyncHandler = async (req, res, next) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        callstack.push('asyncHandler')
        resolve()
      }, 10)
    })
  const asyncHandlerError = async (req, res, next) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        callstack.push('asyncHandlerError')
        reject(new Error('asyncHandlerError'))
      }, 10)
    })

  beforeEach(() => {
    router.middleware = []
    callstack = []
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

  context('Override middleware', () => {
    it('should override global middleware when passed array of middleware', () => {
      const routerMiddleware = inner => {
        return (req, res, next) => {
          throw new Error('Must not be called')
        }
      }
      const routeSpecificMiddleware = inner => {
        return (req, res, next) => {
          callstack.push('routeSpecificMiddleware:before')
          inner(req, res, next)
          callstack.push('routeSpecificMiddleware:after')
        }
      }

      router.use(routerMiddleware)

      router.all('/', syncHandler, [routeSpecificMiddleware])(
        { url: '/' },
        {},
        nextHandler
      )

      expect(callstack).to.deep.equal([
        'routeSpecificMiddleware:before',
        'syncHandler',
        'routeSpecificMiddleware:after'
      ])
    })

    it('should throw when override is not array of middleware', () => {
      expect(() => {
        router.all('/', syncHandler, '')({ url: '/' }, {}, nextHandler)
      }).to.throw(TypeError)
    })
  })

  context('Sync', () => {
    it('should call stack of middleware', () => {
      const middleware1 = inner => {
        return (req, res, next) => {
          callstack.push('sync1:before')
          inner(req, res, next)
          callstack.push('sync1:after')
        }
      }
      const middleware2 = inner => {
        return (req, res, next) => {
          callstack.push('sync2:before')
          inner(req, res, next)
          callstack.push('sync2:after')
        }
      }

      router.use([middleware1, middleware2])

      router.all('/', syncHandler)({ url: '/' }, {}, nextHandler)

      expect(callstack).to.deep.equal([
        'sync1:before',
        'sync2:before',
        'syncHandler',
        'sync2:after',
        'sync1:after'
      ])
    })
  })

  context('Async', () => {
    it('should call stack of middleware', async () => {
      const middleware1 = inner => {
        return async (req, res, next) => {
          callstack.push('async1:before')
          await inner(req, res, next)
          callstack.push('async1:after')
        }
      }
      const middleware2 = inner => {
        return async (req, res, next) => {
          callstack.push('async2:before')
          await inner(req, res, next)
          callstack.push('async2:after')
        }
      }

      router.use([middleware1, middleware2])

      await router.all('/', asyncHandler)({ url: '/' }, {}, nextHandler)

      expect(callstack).to.deep.equal([
        'async1:before',
        'async2:before',
        'asyncHandler',
        'async2:after',
        'async1:after'
      ])
    })
  })

  context('Error handling', () => {
    it('should handle handler errors gracefully', async () => {
      const middleware1 = inner => {
        return async (req, res, next) => {
          callstack.push('async1:before')
          await inner(req, res, next)
          callstack.push('async1:after')
        }
      }
      const middleware2 = inner => {
        return async (req, res, next) => {
          callstack.push('async2:before')
          try {
            await inner(req, res, next)
          } catch (e) {
            callstack.push('handler:error')
          }
          callstack.push('async2:after')
        }
      }

      router.use([middleware1, middleware2])

      await router.all('/', asyncHandlerError)({ url: '/' }, {}, nextHandler)

      expect(callstack).to.deep.equal([
        'async1:before',
        'async2:before',
        'asyncHandlerError',
        'handler:error',
        'async2:after',
        'async1:after'
      ])
    })
  })
})
