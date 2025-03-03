const mongoose = require('mongoose');

const EmailConfirmationTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmailConfirmationToken', EmailConfirmationTokenSchema);
