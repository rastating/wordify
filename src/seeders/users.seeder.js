/* eslint-disable */
const faker = require('faker');
const { Seeder } = require('mongoose-data-seed');

const User = require('../models/User');

const data = [];

for (let i = 0; i < 5; i += 1) {
  const name = faker.name.firstName().toLowerCase();

  data.push({
    email: faker.internet.email(),
    username: name,
    password: faker.internet.password(),
    bio: faker.lorem.paragraph(4)
  });
}

class UsersSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return User.create(data);
  }
}

module.exports = UsersSeeder;
