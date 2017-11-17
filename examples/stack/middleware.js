module.exports = {
  logging: inner => {
    return async (req, res, next) => {
      await inner(req, res, next)
      console.log(`${req.method} ${req.url} - HTTP ${res.statusCode}`)
    }
  },
  correlationId: inner => {
    return async (req, res, next) => {
      var correlationId = Math.floor(Math.random() * 10000) + 10000
      res.setHeader('Correlation-Id', correlationId)
      await inner(req, res, next)
    }
  }
}
