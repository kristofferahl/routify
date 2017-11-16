var url = require('url')
var paramify = require('paramify')

var routify = {
  middleware: [],
  use: function (middleware) {
    if (Array.isArray(middleware)) {
      return Array.prototype.push.apply(this.middleware, middleware)
    } else if (typeof middleware === 'function') {
      return this.middleware.push(middleware)
    }
    throw new TypeError('middleware must be a function')
  }
}

function router (method) {
  return function (path, handler) {
    return function (req, res, next) {
      if (req.method !== (method || req.method)) {
        return next()
      }

      var match = paramify(url.parse(req.url).pathname)
      if (match(path)) {
        req.params = match.params
        return handler(req, res, next)
      }
      return next()
    }
  }
}

routify.all = router()

var methods = ['get', 'post', 'put', 'delete']
methods.forEach(function (method) {
  routify[method] = router(method.toUpperCase())
})

module.exports = routify
