const express = require('express')
const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')
const cors = require('cors')

const server = express()

server.use(logger)
server.use(express.json())
server.use(cors()) // for stretch
server.use('/api/users', userRouter)
server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
})

//custom middleware

function logger(req, res, next) {
  console.log(`A ${req.method} request was sent to ${req.url} at ${new Date().toISOString()}`)
  next()
}

module.exports = server
