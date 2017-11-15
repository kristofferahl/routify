var http = require('http')
var Stack = require('stack')
var router = require('./../../routify.js')

var routes = require('./routes/index.js')

http
  .createServer(
    Stack(
      router.all('/', routes.index),
      router.get('/signup', routes.signup.get),
      router.post('/signup', routes.signup.post),
      router.get('/documents/:id', routes.documents.get),
      router.get('/stuff/:userId', function (req, res, next) {
        console.log('Accessed user stuff', req.params.userId)
        res.end("Here's you're stuff - " + req.params.userId)
      })
    )
  )
  .listen(1337)
