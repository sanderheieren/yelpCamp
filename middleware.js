module.exports.isLoggedIn = (req,res,next) => {
  //store url they are requesting (session, statefullness)
    if(!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl; // req obj will now have returnTo on it
      req.flash('error', 'you must be signed in first');
      return res.redirect('/login');
  }
  next()
}