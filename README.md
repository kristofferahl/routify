# Routify [![NPM version](https://badge.fury.io/js/http-routify.png)](http://badge.fury.io/js/http-routify)

Routify is a minimal http routing module for node.js.

It mixes the simplicity of tiny-route with the parameter support of paramify.

## Install

If you use npm, then install the package via npm.

    npm install http-routify

If you're not using npm, simply copy the file `routify.js` to a directory of your choice.

## Example

	var http = require('http');
	var Stack = require('stack');
	var router = require('http-routify');

	var routes = require('./routes/index.js')

	http.createServer(Stack(
		router.all('/', routes.index),
		router.get('/signup', routes.signup.get),
		router.post('/signup', routes.signup.post),
		router.get('/documents/:id', routes.documents.get),
		router.get('/stuff/:userId', function (req, res, next) {
			console.log('Accessed user stuff', req.params.userId);
			res.end("Here's you're stuff - " + req.params.userId);
		})
	)).listen(1337);

### Run example

	npm start

Open up a browser or command line and test the routes on http://localhost:1337

## More

Each route handler needs to be of the form:

    function handler(req, res, next) {
      // Either handle the request here using `req` and `res`
      // or call `next()` to pass control to next route
    }

### More about paramify

https://github.com/hij1nx/paramify

### More about tiny-route

https://github.com/dominictarr/tiny-route

### More about stack

https://github.com/creationix/stack
