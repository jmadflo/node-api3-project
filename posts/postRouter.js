const express = require('express')
const postData = require('../posts/postDb')
// const { validatePost } = require('../users/userRouter')

const router = express.Router()

// These routes have a base url of http://localhost:7000/api/posts

router.get('/', (req, res) => {
  postData.get()
    .then(allPosts => {
      // returns all posts
      res.status(200).json(allPosts)
    })
    .catch(() =>{
      res.status(500).json({ message: 'The posts could not be retrieved from the database.' })
    })
})

router.get('/:id', validatePostId, (req, res) => {
  postData.getById(req.params.id)
    .then(singlePost => {
      // returns the one post with an id of req.user.id
      res.status(200).json(singlePost)
    })
    .catch(() => {
      res.status(500).json({ message: `The post with an id of ${req.params.id} could not be retrieved from the database.` })
    })
})

router.delete('/:id', validatePostId, validatePost, (req, res) => {
  postData.remove(req.params.id)
    .then(numberOfDeletedPosts => {
      // only returns a confirmation message
      if (numberOfDeletedPosts === 1){
        res.status(200).json({ message: `The post with an id of ${req.params.id} was deleted from the database.` })
      } else {
        res.status(500).json({ message: `The post with an id of ${req.params.id} could not be deleted from the database.` })
      }
    })
    .catch(() => {
      res.status(500).json({ message: `The post with an id of ${req.params.id} could not be deleted from the database.` })
    })
})

router.put('/:id', validatePostId, validatePost, (req, res) => {
  // first, post with id of req.params.id is updated
  postData.update(req.params.id, req.body)
    .then(numberOfUpdatedPosts => {
      // then, if update is successful, get the updated post and return it to the client
      if (numberOfUpdatedPosts === 1) {
        postData.getById(req.params.id)
          .then(updatedPost => {
            res.status(200).json(updatedPost)
          })
          .catch(() => {
            res.status(500).json({ message: `The post with an id of ${req.params.id} could not be retrieved once updated.` })
          })
      } else {
        res.status(500).json({ message: `The post with an id of ${req.params.id} could not be updated.` })
      }
    })
    .catch(() => {
      res.status(500).json({ message: `The post with an id of ${req.params.id} could not be updated.` })
    })
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

function validatePost(req, res, next) {
  // send 400 error if req.body is missing or if req.body.text is missing
  if (!req.body){
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text){
    res.status(400).json({ message: "missing required text field" })
  } else {
    next()
  }
}

module.exports = router
