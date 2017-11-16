var url = require('url')
var paramify = require('paramify')

var routify = {
  middleware: [],
  use: function (middleware) {
    validate(middleware)
    appendTo(routify.middleware, middleware)
  }
}

function validate (middleware) {
  if (!Array.isArray(middleware) && typeof middleware !== 'function') {
    throw new TypeError(
      'middleware must be a function or an array of functions'
    )
  }
}

function appendTo (arr, middleware) {
  if (Array.isArray(middleware)) {
    return Array.prototype.push.apply(arr, middleware)
  } else {
    return arr.push(middleware)
  }
}

function router (method) {
  return function (path, handler, middleware) {
    typeof middleware !== 'undefined' && validate(middleware)

    return function (req, res, next) {
      if (req.method !== (method || req.method)) {
        return next()
      }

      var match = paramify(url.parse(req.url).pathname)
      if (match(path)) {
        req.params = match.params

        middleware = middleware || routify.middleware

        var inner = handler
        var i = middleware.length
        while (i--) {
          inner = middleware[i].call(this, inner)
        }

        return inner(req, res, next)
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
