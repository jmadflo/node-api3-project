const userData = require('./users/userDb')

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
        res.status(400).json({ message: "missing required name field" });
    } else {
        next()
    }
    
}

function validatePost(req, res, next) {

}

module.exports = { validateUserId, validateUser, validatePost }