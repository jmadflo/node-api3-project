const userData = require('./users/userDb')

function validateUserId(req, res, next) {
    // get user with the params id and assign it to req.user, otherwise return a 400 error
    userData.getById(req.params.id)
        .then(user => {
            req.user = user
            next()
        })
        .catch(() => {
            res.status(400).json({ message: "invalid user id" });
        })
}

function validateUser(req, res, next) {

}

// validatePost()

module.exports = { validateUserId, validateUser, validatePost }