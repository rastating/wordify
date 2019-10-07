const mongoose = require('mongoose');

const mongoURL = process.env.MONGO || 'mongodb://localhost:27017/wordify';

const Users = require('./src/seeders/users.seeder');
const Articles = require('./src/seeders/articles.seeder');

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
exports.seedersList = { Users, Articles };
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
exports.connect = () =>
  mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
exports.dropdb = () => mongoose.connection.db.dropDatabase();
