const express = require('express')
const userData = require('./userDb')

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
      res.status(500).json({ errorMessage: 'The user could not be inserted into the database' })
    })
  

})

// inserts new post
router.post('/:id/posts', (req, res) => {
  // 
})

router.get('/', (req, res) => {
  // do your magic!
})

router.get('/:id', (req, res) => {
  // do your magic!
})

router.get('/:id/posts', (req, res) => {
  // do your magic!
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
