const express = require('express')
const userRouter = require('./users/userRouter')

const server = express()
server.use(logger)
server.use(express.json())
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
})

//custom middleware

function logger(req, res, next) {
  console.log(`A ${req.method} request was sent from ${req.url} at ${new Date().toISOString()}`)
  next()
}

module.exports = server
