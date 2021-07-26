const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.post('/login', authenticate);
router.post('/register', register);

module.exports = router;

function authenticate(req, res, next) {
    userService._login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService._register(req.body)
        .then(() =>  res.send({
            message: "user create successfully"
        }))
        .catch(err => next(err));
}

