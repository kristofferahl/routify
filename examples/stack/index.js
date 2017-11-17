var http = require('http')
var Stack = require('stack')
var router = require('./../../routify.js')
var middleware = require('./middleware.js')

router.use(middleware.logging)
router.use(middleware.correlationId)

http
  .createServer(
    Stack(
      router.all('/', (req, res) => res.end('Root')),

      router.post('/blog/posts/', async (req, res) => {
        const db = () => new Promise(resolve => setTimeout(resolve, 1000))
        await db({ slug: 'async-is-cool' })
        res.statusCode = 201
        res.end('Created blog post')
      }),

      router.get('/blog/posts/:slug', (req, res) => {
        res.statusCode = 200
        res.end(`Found post with slug: ${req.params.slug}`)
      }),

      router.all('/*', (req, res) => {
        res.statusCode = 404
        res.end(`HTTP Not Found - ${req.method} ${req.url}`)
      })
    )
  )
  .listen(1337, () => {
    console.log('Server started (http://localhost:1337)')
  })
