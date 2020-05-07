const express = require('express')
const userData = require('./userDb')
const postData = require('../posts/postDb')

const router = express.Router()

// These routes have a base url of http://localhost:7000/api/users

// inserts new use into database
router.post('/', validateUser, (req, res) => {
  // do your magic!
  console.log(req.body)
  userData.insert(req.body)
    .then(insertedUser => {
      console.log(insertedUser)
      // returns inserted user
      res.status(200).json(insertedUser)
    })
    .catch(() => {
      res.status(500).json({ message: 'The user could not be inserted into the database.' })
    })
})

// inserts new post and does validation through middleware
router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  // insert new post
  postData.insert({ ...req.body, user_id: req.params.id })
    .then(insertedPost => {
      // returns the inserted post
      res.status(200).json(insertedPost)
    })
  .catch(() => {
    res.status(500).json({ message: `The post could not be inserted into the database for user with an id of ${req.params.id}.` })
  })
})

// gets array of all of the users
router.get('/', (req, res) => {
  userData.get()
    .then(allUsers => {
      // returns all users
      res.status(200).json(allUsers)
    })
    .catch(() =>{
      res.status(500).json({ message: 'The users could not be retrieved from the database.' })
    })
})

// get user by its id
router.get('/:id', validateUserId, (req, res) => {
  userData.getById(req.params.id)
    .then(singleUser => {
      // returns the one user with an id of req.user.id
      res.status(200).json(singleUser)
    })
    .catch(() => {
      res.status(500).json({ message: `The user with an id of ${req.params.id} could not be retrieved from the database.` })
    })
})

// return all posts for a particular user
router.get('/:id/posts', validateUserId, (req, res) => {
  userData.getUserPosts(req.params.id)
    .then(allPostsForUser => {
      // return all posts for user with an id of req.user.id
      res.status(200).json(allPostsForUser)
    })
    .catch(() => {
      res.status(500).json({ message: `The posts associated with the user with an id of ${req.params.id} could not be retrieved from the database.` })
    })
  })

// deletes user with an id of req.params.id
router.delete('/:id', validateUserId, (req, res) => {
  userData.remove(req.params.id)
    .then(numberOfDeletedUsers => {
      // only returns a confirmation message
      if (numberOfDeletedUsers === 1){
        res.status(200).json({ message: `The user with an id of ${req.params.id} was deleted from the database.` })
      } else {
        res.status(500).json({ message: `The user with an id of ${req.params.id} could not be deleted from the database.` })
      }
    })
    .catch(() => {
      res.status(500).json({ message: `The user with an id of ${req.params.id} could not be deleted from the database.` })
    })
})

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // first user with id of req.params.id is updated
  userData.update(req.params.id, req.body)
    .then(numberOfUpdatedUsers => {
      // then, if update is successful, get the updated user and return it to the client
      if (numberOfUpdatedUsers === 1) {
        userData.getById(req.params.id)
          .then(updatedUser => {
            res.status(200).json(updatedUser)
          })
          .catch(() => {
            res.status(500).json({ message: `The user with an id of ${req.params.id} could not be retrieved once updated.` })
          })
      } else {
        res.status(500).json({ message: `The user with an id of ${req.params.id} could not be updated.` })
      }
    })
    .catch(() => {
      res.status(500).json({ message: `The user with an id of ${req.params.id} could not be updated.` })
    })
})

//custom middleware

function validateUserId(req, res, next) {
  // get user with the params id and assign it to req.user, otherwise return a 400 error
  userData.getById(req.params.id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(() => {
      res.status(400).json({ message: "invalid user id" })
    })
}

function validateUser(req, res, next) {
  // send 400 error if req.body is missing or if req.body.name is missing
  if (!req.body){
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name){
    res.status(400).json({ message: "missing required name field" })
  } else {
    next()
  }
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
