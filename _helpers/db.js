const config = require('config.json');
const mongoose = require('mongoose');

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true,
     useFindAndModify: false };
mongoose.connect(config.connectionString, connectionOptions);

module.exports = {
    User: require('../users/user.model')
};