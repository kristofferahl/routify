var http = require('http');
var stack = require('stack');
var route = require('./../../routify.js');

var routes = require('./routes/index.js')

http.createServer(stack(
	route('/', routes.index),
	route.get('/signup', routes.signup.get),
	route.post('/signup', routes.signup.post),
	route.get('/documents/:id', routes.documents.get),
	route.get('/stuff/:userId', function (req, res, next) {
		console.log('Accessed user stuff', req.params.userId);
		res.end("Here's you're stuff - " + req.params.userId);
	})
)).listen(1337);