const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    _register,
    _login,
};


async function _register(userData) {
    if (await User.findOne({ username: userData.username })) {
        throw 'Username ' + userData.username + 'is already taken';
    }

    const user = new User(userData);
    if (userData.password) {
        user.hash = bcrypt.hashSync(userData.password, 10);
    }
    await user.save();
}


async function _login({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

