var paramify = require('paramify')

function router (method) {
  return function (path, handler) {
    return function (req, res, next) {
      if (req.method !== method) {
        return next()
      }

      var match = paramify(req.url)
      if (match(path)) {
        req.params = match.params
        return handler(req, res, next)
      }
      return next()
    }
  }
}

var routify = {}
var methods = ['get', 'post', 'put', 'delete']

methods.forEach(function (method) {
  routify[method] = router(method.toUpperCase())
})

module.exports = routify
