# Routify [![NPM version](https://badge.fury.io/js/http-routify.png)](http://badge.fury.io/js/http-routify)

Routify is a minimal http routing module for node.

It mixes the simplicity of tiny-route with the parameter support of paramify.

## Install

    npm install http-routify

## Example

    var http = require('http')
    var Stack = require('stack')
    var router = require('http-routify')

    http
      .createServer(
        Stack(
          router.get('/', (req, res) => res.end('Root')),
          router.post('/blog/posts/', (req, res) => {
            res.statusCode = 201
            res.end('Created blog post')
          }),
          router.get('/blog/posts/:slug', (req, res) => {
            res.end(`We support parameters as well: ${req.params.slug}`)
          })
        )
      )
      .listen(1337)

### Running the example

The example uses Stack and requires node 8 or above.

    npm start

Open up a browser or command line and test the routes on http://localhost:1337

## Test

Running the tests requires node 8 or above.

    npm test

### Watch

    npm run test:watch

## API

### Routing

    router.verb(path,handler[,middleware])

- `path: <string>`  
  A path pattern relative to the root. Example: `/api/users/:id`

- `handler: <function>`  
  The handler to execute when the request matches. See [Handlers](#handlers).

- `middleware: <array>`  
  [Optional] Array of middleware to execute before executing the handler. Overrides all middleware globally applied to the router. See [Middleware](#middleware).

The router currently supports the following HTTP verbs

#### router.get

Matches HTTP GET requests

#### router.post

Matches HTTP POST requests

#### router.put

Matches HTTP PUT requests

#### router.delete

Matches HTTP DELETE requests

#### router.all

`router.all` is a bit special. It matches any HTTP verb and only matches the url against the path.

### Handlers

Each route handler needs to be of the form:

    function handler (req, res, next) {
      // Either handle the request here using `req` and `res`
      // or call `next()` to pass control to next route
    }

The `next` function is only required in order to delegate handling of a request to the next route in the stack and may be omitted.

### Middleware

The router supports defining middleware that wraps around each route handler, creating a chain of behaviors to be executed. Middleware can be defined globally and overridden on each route.

#### router.use

    router.use(middleware)

- `middleware: <function>`  
  A function that wraps around all route handlers. Middleware may also be specified as an array of functions.

#### Creating middleware

A middleware function needs to be in the form of:

    function middleware (inner) {
      return function (req, res, next) {
        inner(req, res, next)
      }
    }

In general, a middleware should always call any inner functions (middleware or handler) passed to it. However, there are exceptions where you might want to skip calling inner behaviors and end the request in your middleware.

To run code after the inner behavior has executed you may use async/await in handlers and middleware. See example below.

#### Example middleware

    router.use(inner => {
      return (req, res, next) => {
        console.log('Before handler')
        inner(req, res, next)
      }
    })

    router.use(inner => {
      return async (req, res, next) => {
        console.log('Before handler')
        await inner(req, res, next)
        console.log('After handler')
      }
    })

## More

### Bugs and issues

Please report any bugs by opening an issues on Github. 

### Paramify

https://github.com/hij1nx/paramify

### Stack

https://github.com/creationix/stack
