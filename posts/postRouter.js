const express = require('express')
const postData = require('../posts/postDb')

const router = express.Router()

// These routes have a base url of http://localhost:7000/api/posts

router.get('/', (req, res) => {
  // do your magic!
})

router.get('/:id', (req, res) => {
  // do your magic!
})

router.delete('/:id', (req, res) => {
  // do your magic!
})

router.put('/:id', (req, res) => {
  // do your magic!
})

// custom middleware

function validatePostId(req, res, next) {
  // get post with the params id and assign it to req.post, otherwise return a 400 error
  postData.getById(req.params.id)
    .then(post => {
      req.post = post
      next()
    })
    .catch(() => {
      res.status(400).json({ message: "invalid post id" })
    })
}

module.exports = router
