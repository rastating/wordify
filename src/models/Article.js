const slug = require('slug');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ArticleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: true
    },
    title: {
      type: String,
      minlength: 10,
      maxlength: 128,
      required: true
    },
    content: {
      type: String,
      required: true,
      minlength: 32
    },
    image: {
      type: String,
      default: 'https://habiiev-wordify.s3.eu-north-1.amazonaws.com/articles/default.jpg'
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ArticleSchema.methods.slugify = function() {
  this.slug = `${Math.floor(Math.random() * 36 ** 6 || 0).toString()}-${slug(this.title)}`;
};

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken' });

ArticleSchema.pre('validate', function(next) {
  if (!this.slug) this.slugify();
  next();
});

mongoose.model('Article', ArticleSchema);
