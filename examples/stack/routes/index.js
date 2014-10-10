module.exports = {
	index: function (req, res, next) {
		res.end('Index');
	},
	signup: {
		get: function (req, res, next) {
			res.end('Signup ' + req.method);
		},
		post: function (req, res, next) {
			res.end('Signup ' + req.method);
		}
	},
	documents: {
		get: function (req, res, next) {
			res.end('Documents ' + req.method + ' # ' + req.params.id);
		}
	}
}