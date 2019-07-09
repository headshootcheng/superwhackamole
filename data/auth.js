module.exports={
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.render('../views/error', {title: 'Error'});
      },
      
      forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }
    }