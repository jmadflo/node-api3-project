const express = require('express')
const userData = require('./userDb')
const postData = require('../posts/postDb')

const router = express.Router()

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
      res.status(500).json({ errorMessage: 'The user could not be inserted into the database.' })
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
    res.status(500).json({ errorMessage: 'The post could not be inserted into the database.' })
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
      res.status(500).json({ errorMessage: 'The users could not be retrieved from the database.' })
    })
})

// get user by its id
router.get('/:id', (req, res) => {
  userData.getById(req.params.id)
    .then(singleUser => {
      res.status(200).json(singleUser)
    })
    .catch(() => {
      res.status(404).json({ errorMessage: 'The user could not be retrieved from the database.' })
    })
})

router.get('/:id/posts', (req, res) => {
  userData.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(404).json({ errorMessage: 'The user could not be retrieved from the databasee.' });
    })
  })

router.delete('/:id', (req, res) => {
  // do your magic!
})

router.put('/:id', (req, res) => {
  // do your magic!
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
