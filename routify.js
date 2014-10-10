var paramify = require('paramify');

function router (method) {
	return function (path, handler) {
		return function (req, res, next) {
			method = method || req.method;
			if (req.method !== method) return next();

			var match = paramify(req.url);
			if (match(path)) {
				req.params = match.params;
				return handler(req, res, next);
			}
			return next();
		}
	}
}

var routify = module.exports = router();

['get', 'post', 'put', 'delete'].forEach(function (method) {
	routify[method] = router(method.toUpperCase());
});