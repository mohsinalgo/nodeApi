const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    _login,
    _register,
    getAll,
    getById,
    update,
    delete: _delete
};

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

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function _register(userData) {
    if (await User.findOne({ username: userData.username })) {
        throw 'Username '+ userData.username +'is already taken';
    }

    const user = new User(userData);
    if (userData.password) {
        user.hash = bcrypt.hashSync(userData.password, 10);
    }
    await user.save();
}

async function update(id, userData) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';
    if (user.username !== userData.username && await User.findOne({ username: userData.username })) {
        throw 'Username "' + userData.username + '" is already taken';
    }

    if (userData.password) {
        userData.hash = bcrypt.hashSync(userData.password, 10);
    }
    
    Object.assign(user, userData);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}