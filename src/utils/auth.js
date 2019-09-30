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
