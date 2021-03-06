/* global describe context it */

const expect = require('chai').expect
const router = require('../routify.js')

const run = (routerMethod, routerPath) => {
  return (httpMethod, httpUrl) => {
    let hanlderCalled = false
    const handler = (req, res, next) => {
      hanlderCalled = true
    }

    const matcher = router[routerMethod](routerPath, handler)
    const req = {
      method: httpMethod,
      url: httpUrl
    }
    const res = {}
    const next = () => {}

    matcher(req, res, next)

    return {
      request: req,
      ressponse: res,
      match: hanlderCalled
    }
  }
}

describe('routify', () => {
  context('HTTP GET /', () => {
    it('should match for GET', () => {
      expect(run('get', '/')('GET', '/').match).to.equal(true)
    })

    it('should not match POST', () => {
      expect(run('post', '/')('GET', '/').match).to.equal(false)
    })

    it('should not match PUT', () => {
      expect(run('put', '/')('GET', '/').match).to.equal(false)
    })

    it('should not match DELETE', () => {
      expect(run('delete', '/')('GET', '/').match).to.equal(false)
    })
  })

  context('HTTP POST /', () => {
    it('should not match for GET', () => {
      expect(run('get', '/')('POST', '/').match).to.equal(false)
    })

    it('should match POST', () => {
      expect(run('post', '/')('POST', '/').match).to.equal(true)
    })

    it('should not match PUT', () => {
      expect(run('put', '/')('POST', '/').match).to.equal(false)
    })

    it('should not match DELETE', () => {
      expect(run('delete', '/')('POST', '/').match).to.equal(false)
    })
  })

  context('HTTP PUT /', () => {
    it('should not match for GET', () => {
      expect(run('get', '/')('PUT', '/').match).to.equal(false)
    })

    it('should not match POST', () => {
      expect(run('post', '/')('PUT', '/').match).to.equal(false)
    })

    it('should match PUT', () => {
      expect(run('put', '/')('PUT', '/').match).to.equal(true)
    })

    it('should not match DELETE', () => {
      expect(run('delete', '/')('PUT', '/').match).to.equal(false)
    })
  })

  context('HTTP DELETE /', () => {
    it('should not match for GET', () => {
      expect(run('get', '/')('DELETE', '/').match).to.equal(false)
    })

    it('should not match POST', () => {
      expect(run('post', '/')('DELETE', '/').match).to.equal(false)
    })

    it('should not match PUT', () => {
      expect(run('put', '/')('DELETE', '/').match).to.equal(false)
    })

    it('should match DELETE', () => {
      expect(run('delete', '/')('DELETE', '/').match).to.equal(true)
    })
  })

  context('Matching all HTTP methods', () => {
    it('should match GET', () => {
      expect(run('all', '/')('GET', '/').match).to.equal(true)
    })

    it('should match POST', () => {
      expect(run('all', '/')('POST', '/').match).to.equal(true)
    })

    it('should match PUT', () => {
      expect(run('all', '/')('PUT', '/').match).to.equal(true)
    })

    it('should match DELETE', () => {
      expect(run('all', '/')('DELETE', '/').match).to.equal(true)
    })
  })

  context('Request with hash', () => {
    context('Path spec without hash', () => {
      it('/# should match', () => {
        expect(run('get', '/')('GET', '/#abc').match).to.equal(true)
      })

      it('/#/ should match', () => {
        expect(run('get', '/')('GET', '/#/abc').match).to.equal(true)
      })

      it('/#path/ should match', () => {
        expect(run('get', '/')('GET', '/#path/').match).to.equal(true)
      })

      it('/path# should not match', () => {
        expect(run('get', '/')('GET', '/path#').match).to.equal(false)
      })

      it('/path/# should not match', () => {
        expect(run('get', '/')('GET', '/path/#').match).to.equal(false)
      })
    })

    context('Path spec with hash', () => {
      it('should never match', () => {
        expect(run('get', '/#abc')('GET', '/#abc').match).to.equal(false)
        expect(run('get', '/#/abc')('GET', '/#/abc').match).to.equal(false)
        expect(run('get', '/#path/')('GET', '/#path/').match).to.equal(false)
        expect(run('get', '/path#')('GET', '/path#').match).to.equal(false)
        expect(run('get', '/path/#')('GET', '/path/#').match).to.equal(false)
      })
    })
  })

  context('Request ending with slash', () => {
    it('should match path spec without slash', () => {
      expect(run('get', '/path')('GET', '/path/').match).to.equal(true)
    })
  })

  context('Request with querystring', () => {
    it('should ignore querystring from match', () => {
      expect(run('get', '/path')('GET', '/path?foo=bar').match).to.equal(true)
    })
  })

  context('Request with parameters', () => {
    it('should match path with parameter', () => {
      expect(run('get', '/path/:id')('GET', '/path/123').match).to.equal(true)
    })

    context('Request object extension', () => {
      it('should extend request with params object', () => {
        const result = run('get', '/path')('GET', '/path')
        expect(result.request.params).to.deep.equal([])
        expect(Object.keys(result.request.params).length).to.equal(0)
      })

      it('should have parameter id', () => {
        const result = run('get', '/path/:id')('GET', '/path/123')
        expect(result.request.params.id).to.equal('123')
        expect(Object.keys(result.request.params).length).to.equal(1)
      })

      it('should have parameter action and id', () => {
        const result = run('get', '/:action/:id')('GET', '/create/456')
        expect(result.request.params.action).to.equal('create')
        expect(result.request.params.id).to.equal('456')
        expect(Object.keys(result.request.params).length).to.equal(2)
      })
    })
  })
})
