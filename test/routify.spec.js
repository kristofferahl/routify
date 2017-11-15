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

describe('routify.js', () => {
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
