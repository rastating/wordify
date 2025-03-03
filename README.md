<div align="center">
  <img src="https://i.imgur.com/KSugaI9.png" alt="Wordify logo" height="100">

  <p>A simple small blog application built using Node / Express / MongoDB</p>
  <p><a href="https://habiiev-wordify.herokuapp.com/" target="_blank">Visit the website &rarr;</a></p>
</div>

---

## Dependencies

- [Express](https://www.npmjs.com/package/express) - Minimalist web framework for node.js
- [Dotenv](https://www.npmjs.com/package/dotenv) - Module that loads environment variables from `.env`
- [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger
- [Pug](https://www.npmjs.com/package/pug) - Templating engine for Node.js
- [Mongoose](https://www.npmjs.com/package/mongoose) - MongoDB ODM
- [Mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) - Pre-save validation for unique fields within a Mongoose schema
- [Slug](https://www.npmjs.com/package/slug) - Slugifies strings
- [Express-validator](https://www.npmjs.com/package/express-validator) - Express middleware for [validator](https://www.npmjs.com/package/validator)
- [Method-override](https://www.npmjs.com/package/method-override) - Module that allows me to use PUT and DELETE methods from client side
- [Express-session](https://www.npmjs.com/package/express-session) - Session middleware
- [Cookie-parser](https://www.npmjs.com/package/cookie-parser) - Parses cookie headers
- [Express-flash](https://www.npmjs.com/package/express-flash) - Flash messages middleware
- [Express-autosanitizer](https://www.npmjs.com/package/express-autosanitizer) - data sanitization
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - library for hashing passwords
- [Passport](https://www.npmjs.com/package/passport) - authentication middleware for node.js
- [Passport-local](https://www.npmjs.com/package/passport-local) - passport strategy for authentication using username and password
- [PM2](https://www.npmjs.com/package/pm2) - production process manager with load balancer
- [Multer](https://www.npmjs.com/package/multer) - node.js middleware for handling multipart/form-data
- [Multer-S3](https://www.npmjs.com/package/multer-s3) - multer storage engine for AWS S3
- [AWS-SDK](https://www.npmjs.com/package/aws-sdk) - official AWS SDK
- [Mongoose-data-seed](https://www.npmjs.com/package/mongoose-data-seed) - seed mongodb database using mongoose models
- [Faker](https://www.npmjs.com/package/faker) - package for generating fake data
- [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) - service that is a part of [sendgrid](https://www.npmjs.com/package/sendgrid) that is dedicated for sending mail only using Sendgrid API

**Development**:

- [Nodemon](https://www.npmjs.com/package/nodemon) - Development server that automatically restarts when file changes in the directory are detected
- [Prettier](https://www.npmjs.com/package/prettier) - Opinionated code formatter
- [Eslint](https://www.npmjs.com/package/eslint) - Javascript linter
- [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) - Airbnb style guide for eslint

## Starting in a development environment

1. Clone the repo from git:

   `git clone https://github.com/habiiev/wordify`

2. `cd` to the folder you cloned the repo in (by default `wordify`):

   `cd wordify`

3. Install the dependencies:

   `yarn install` or `npm install`

4. Fill in the `.env` file

5. Seed the database:

   `yarn seed` or `npm run seed`

6. Start the development server:

   `yarn start:dev` or `npm run start:dev`

7. Open `http://localhost:5500` in browser

## Deploying to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

<p align="center">Copyright 2019 &copy; Oleksii Habiiev</p>
