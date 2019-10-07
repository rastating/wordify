exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  req.flash('error', 'You have to be logged in to view this content.');
  res.redirect('/auth/login');
};

exports.redirectAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return next();

  req.flash('error', 'You cannot view this page while you are logged in');
  res.redirect('/');
};

// Middleware for checking if the user email is verified
exports.emailVerified = (req, res, next) => {
  if (!req.user.emailConfirmed) {
    req.flash('error', 'You must confirm your email to proceed with these actions');
    return res.redirect('/profile/update');
  }

  next();
};

exports.emailNotVerified = (req, res, next) => {
  if (req.user.emailConfirmed) {
    req.flash('error', 'Your email is already verified');
    return res.redirect('/profile/update');
  }

  next();
};
