let express = require('express');
let router = express.Router();
let User = require('../data/account');
let mail = require('../data/mail');
let bcrypt = require('bcryptjs');
let saltRounds = 10;
let passport = require('passport');
let url = require('url');
let multer = require('multer');
let path = require('path');
let fs = require('fs');
let ejs = require('ejs')
let {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../data/auth');

let insertaccount = `INSERT INTO account(username,email,password) VALUES (?,?,?)`
let checkusername = `SELECT * FROM account WHERE username=?`
let checkemail = `SELECT * FROM account WHERE email=?`
let checkusernameandmail = `SELECT * from account WHERE username=? AND email=?`
let checkicon = `SELECT * from icon WHERE username=?`
let checkscore = `SELECT * from gamedata WHERE username=?`
let updatepw = `UPDATE account SET password=? WHERE username=?`
let updateemail = `UPDATE account SET email=? WHERE username=?`
let inserticon = `INSERT INTO icon(username,name,type,size,path) VALUES (?,?,?,?,?)`
let deleteicon = `DELETE from icon where username= ?`
let insertscore = `INSERT INTO gamedata(username,highestscore) VALUES(?,?)`
let deletescore = `DELETE from gamedata where username=?`
let checkrank = `SELECT * from gamedata ORDER BY highestscore DESC`

//Login Page
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});

//Register
router.get('/register', function (req, res, next) {
  res.render('register', {
    title: 'Sign Up'
  });
});
//Forgot Password
router.get('/forgotpw', function (req, res, next) {
  res.render('forgotpw', {
    title: 'Forgot Password'
  });
});
//Reset Password

let resetpwusername;
let resetpwemail;
router.get('/resetpw', function (req, res, next) {
  var params = url.parse(req.url, true).query;
  resetpwusername = params.username;
  resetpwemail = params.email;
  User.query(checkusernameandmail, [resetpwusername, resetpwemail], function (err, result) {
    if (result.length > 0) {
      res.render('resetpw', {
        title: 'Reset Password'
      });
    } else {
      resetpwusername = undefined;
      resetpwemail = undefined;
      res.render('error', {
        title: 'Error'
      });
    }
  })
})

router.post('/resetforgotpw', function (req, res, next) {
  let newforgotpw = req.body.newpassword1;
  bcrypt.hash(newforgotpw, saltRounds).then(function (forgothash) {

    User.query(updatepw, [forgothash, resetpwusername], function (err, result) {
      resetpwusername = undefined;
      resetpwemail = undefined;
      req.flash('success_msg', 'The password is reset');
      res.redirect('login');
    })
  })

})

router.post('/forgotpw', function (req, res, next) {
  let forgotusername = req.body.username;
  let forgotemail = req.body.email;
  let template = ejs.compile(fs.readFileSync(path.resolve('views/mail.ejs'), 'utf8'));
  let html = template({
    username_msg: forgotusername,
    email_msg: forgotemail
  });

  let mailOptions = {
    from: 'webgamesystem7788@gmail.com',
    to: forgotemail,
    subject: 'Reset your password',
    html: html
  };

  User.query(checkusernameandmail, [forgotusername, forgotemail], function (err, result) {
    if (result.length == 0) {
      req.flash('error', 'Wrong Username Or Email');
      res.redirect('/users/forgotpw');
    } else {
      res.render('mail', {
        layout: null,
        username_msg: forgotusername
      }, function (err, html) {
        mail.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      })
      req.flash('success_msg', 'Email is sent');
      res.redirect('/users/forgotpw');
    }

  })
})




router.post('/register', function (req, res, next) {
  let errors = [];
  let errornum = 0;
  let {
    username,
    email,
    password1,
    password2
  } = req.body;


  User.query(checkusername, [username], function (err, result) {
    if (result.length > 0) {
      errors.push({
        msg: 'Username is already used'
      });
      errornum++;
    }
    User.query(checkemail, [email], function (err, result) {
      if (result.length > 0) {
        errors.push({
          msg: 'Email is already registered'
        });
        errornum++;
      }

      if (errornum > 0) {
        res.render('register', {
          title: 'Sign Up',
          errors,
          username,
          email,
          password1,
          password2
        });
      } else {
        bcrypt.hash(password1, saltRounds).then(function (hash) {
          User.query(insertaccount, [username, email, hash], function (err, result) {
            req.flash('success_msg', 'You are successfully registered');
            res.redirect('/users/login');
          })
        });
      }
    })

  })

});



router.post('/login', function (req, res, next) {
  user_info = req.body.username;



  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    successFlash: true,
    failureFlash: true
  })(req, res, next);
});




router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are successfully logged out');
  res.redirect('/users/login');
});





module.exports = router;