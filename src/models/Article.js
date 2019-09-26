const slug = require('slug');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ArticleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
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
    }
  },
  { timestamps: true }
);

ArticleSchema.methods.slugify = function() {
  const date = new Date();
  this.slug = `${date.getFullYear().toString()}-${date.getMonth().toString()}${(
    Math.random() * 36 ** 6 || 0
  ).toString()}-${slug(this.title)}`;
};

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken' });

ArticleSchema.pre('validate', function(next) {
  if (!this.slug) this.slugify();
  next();
});

mongoose.model('Article', ArticleSchema);
