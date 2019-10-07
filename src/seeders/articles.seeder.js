/* eslint-disable */
const faker = require('faker');
const { Seeder } = require('mongoose-data-seed');

const User = require('../models/User');
const Article = require('../models/Article');

class ArticlesSeeder extends Seeder {
  async beforeRun() {
    this.users = await User.find({}).exec();
    this.postData = this.generatePosts();
  }

  async shouldRun() {
    return Article.countDocuments()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return Article.create(this.postData);
  }

  generatePosts() {
    return Array.apply(null, Array(25)).map(() => {
      const randomUser = faker.random.arrayElement(this.users);

      return {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        author: randomUser
      };
    });
  }
}

module.exports = ArticlesSeeder;
