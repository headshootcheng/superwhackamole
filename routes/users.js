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
let fs=require('fs');
let ejs=require('ejs')
let {ensureAuthenticated,forwardAuthenticated}=require('../data/auth');

let insertaccount = `INSERT INTO account(username,email,password) VALUES (?,?,?)`
let checkusername = `SELECT * FROM account WHERE username=?`
let checkemail = `SELECT * FROM account WHERE email=?`
let checkusernameandmail=`SELECT * from account WHERE username=? AND email=?`
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
router.get('/resetpw',function(req,res,next){
  var params = url.parse(req.url, true).query;
  resetpwusername=params.username;
  resetpwemail=params.email;
  User.query(checkusernameandmail,[resetpwusername,resetpwemail],function(err,result){
    if(result.length>0){
      res.render('resetpw',{
        title:'Reset Password'
      });
    }
    else{
      resetpwusername=undefined;
      resetpwemail=undefined;
      res.render('error', {
        title: 'Error'
      });
    }
  })
})

router.post('/resetforgotpw',function(req,res,next){
  let newforgotpw=req.body.newpassword1;
  bcrypt.hash(newforgotpw, saltRounds).then(function (forgothash){

    User.query(updatepw,[forgothash,resetpwusername],function(err,result){
      resetpwusername=undefined;
      resetpwemail=undefined;
      req.flash('success_msg','The password is reset');
    res.redirect('login');
    })
  })
  
})

router.post('/forgotpw', function (req, res, next) {
   let forgotusername = req.body.username;
   let forgotemail = req.body.email;
  let template = ejs.compile(fs.readFileSync(path.resolve('views/mail.ejs'),'utf8'));
  let html = template({
    username_msg:forgotusername,
    email_msg:forgotemail
  });
  
  let mailOptions = {
    from: 'webgamesystem7788@gmail.com',
    to: forgotemail,
    subject: 'Reset your password',
    html:html
  };
  
  User.query(checkusernameandmail, [forgotusername,forgotemail], function (err, result) {
    if (result.length==0) {
      req.flash('error','Wrong Username Or Email');
      res.redirect('/users/forgotpw');
    }
    else{
      res.render('mail',{layout:null,username_msg:forgotusername},function(err,html){
        mail.sendMail( mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      })
      req.flash('success_msg','Email is sent');
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
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    successFlash: true,
    failureFlash: true
  })(req, res, next);
});


//Set Storage Engine
let storage = multer.diskStorage({
  destination: './public/images/icon/',
  filename: function (req, file, cb) {
    cb(null, user_info + '.jpg');
  }
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (req, file, cb) {
    checkfiletype(file, cb);
  }
}).single('usericon');

function checkfiletype(file, cb) {
  let filetypes = /jpeg|jpg|png/;
  let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  let mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb();
  }
}

router.get('/dashboard', ensureAuthenticated,function (req, res, next) {
 
  //Dashboard
let user_info=req.user.username;
let email_info=req.user.email;
let score_info;
let icon_info
let number1_info_username;
let number1_info_icon;
let number1_info_score;
let number2_info_username;
let number2_info_icon;
let number2_info_score;
let number3_info_username;
let number3_info_icon;
let number3_info_score;
let number4_info_username;
let number4_info_icon;
let number4_info_score;
let number5_info_username;
let number5_info_icon;
let number5_info_score;
let number6_info_username;
let number6_info_icon;
let number6_info_score;
let number7_info_username;
let number7_info_icon;
let number7_info_score;
let number8_info_username;
let number8_info_icon;
let number8_info_score;
let number9_info_username;
let number9_info_icon;
let number9_info_score;
let number10_info_username;
let number10_info_icon;
let number10_info_score;




  User.query(checkusername, [user_info], function (err, result) {
    email_info = result[0].email;
  })

  User.query(checkicon, [user_info], function (err, result) {
    if (result.length > 0) {
      icon_info = result[0].name;
    } else {
      icon_info = 'default.jpg';
    }
  })

  User.query(checkscore, [user_info], function (err, result) {
    if (result.length > 0) {
      score_info = result[0].highestscore;
    } else {
      score_info = '0';
    }
  })

  User.query(checkrank, function (err, result) {

    if (result[0]) {
      number1_info_username = result[0].username;
      number1_info_score = result[0].highestscore;
      User.query(checkicon, [number1_info_username], function (err, icon) {
        if (icon.length > 0) {
          number1_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number1_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[0]) {
      number1_info_username = '/';
      number1_info_score = '/';
      number1_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[1]) {
      number2_info_username = result[1].username;
      number2_info_score = result[1].highestscore;
      User.query(checkicon, [number2_info_username], function (err, icon) {
        if (icon.length > 0) {
          number2_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number2_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[1]) {
      number2_info_username = '/';
      number2_info_score = '/';
      number2_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[2]) {
      number3_info_username = result[2].username;
      number3_info_score = result[2].highestscore;
      User.query(checkicon, [number3_info_username], function (err, icon) {
        if (icon.length > 0) {
          number3_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number3_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[2]) {
      number3_info_username = '/';
      number3_info_score = '/';
      number3_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[3]) {
      number4_info_username = result[3].username;
      number4_info_score = result[3].highestscore;
      User.query(checkicon, [number4_info_username], function (err, icon) {
        if (icon.length > 0) {
          number4_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number4_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[3]) {
      number4_info_username = '/';
      number4_info_score = '/';
      number4_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[4]) {
      number5_info_username = result[4].username;
      number5_info_score = result[4].highestscore;
      User.query(checkicon, [number5_info_username], function (err, icon) {
        if (icon.length > 0) {
          number5_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number5_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[4]) {
      number5_info_username = '/';
      number5_info_score = '/';
      number5_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[5]) {
      number6_info_username = result[5].username;
      number6_info_score = result[5].highestscore;
      User.query(checkicon, [number6_info_username], function (err, icon) {
        if (icon.length > 0) {
          number6_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number6_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[5]) {
      number6_info_username = '/';
      number6_info_score = '/';
      number6_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[6]) {
      number7_info_username = result[6].username;
      number7_info_score = result[6].highestscore;
      User.query(checkicon, [number7_info_username], function (err, icon) {
        if (icon.length > 0) {
          number7_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number7_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[6]) {
      number7_info_username = '/';
      number7_info_score = '/';
      number7_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[7]) {
      number8_info_username = result[7].username;
      number8_info_score = result[7].highestscore;
      User.query(checkicon, [number8_info_username], function (err, icon) {
        if (icon.length > 0) {
          number8_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number8_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[7]) {
      number8_info_username = '/';
      number8_info_score = '/';
      number8_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[8]) {
      number9_info_username = result[8].username;
      number9_info_score = result[8].highestscore;
      User.query(checkicon, [number9_info_username], function (err, icon) {
        if (icon.length > 0) {
          number9_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number9_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[8]) {
      number9_info_username = '/';
      number9_info_score = '/';
      number9_info_icon = 'images/icon/' + 'default.jpg';
    }
    if (result[9]) {
      number10_info_username = result[9].username;
      number10_info_score = result[9].highestscore;
      User.query(checkicon, [number10_info_username], function (err, icon) {
        if (icon.length > 0) {
          number10_info_icon = 'images/icon/' + icon[0].name;
        } else {
          number10_info_icon = 'images/icon/' + 'default.jpg';
        }
      })
    }
    if (!result[9]) {
      number10_info_username = '/';
      number10_info_score = '/';
      number10_info_icon = 'images/icon/' + 'default.jpg';
    }

  })
    var params = url.parse(req.url, true).query;
    //Home
    if (!params.act) {
      res.render('dashboard', {
        title: user_info + "'s Dashboard",
        user_msg: user_info,
        icon_msg: 'images/icon/' + icon_info,
        dashboardpage_msg: ''
      });
    }


    //Profile
    else if (params.act == 'profile') {
      res.render('dashboard', {
        title: user_info + "'s Dashboard",
        user_msg: user_info,
        email_msg: email_info,
        icon_msg: 'images/icon/' + icon_info,
        dashboardpage_msg: 'profile'
      });
    }
    //Reset 
    else if (params.act == 'resetpw') {
      res.render('dashboard', {
        title: user_info + "'s Dashboard",
        user_msg: user_info,
        icon_msg: 'images/icon/' + icon_info,
        dashboardpage_msg: 'resetpw'
      });
    }
    //Game
    else if (params.act == 'game') {
      res.render('dashboard', {
        title: user_info + "'s Dashboard",
        user_msg: user_info,
        icon_msg: 'images/icon/' + icon_info,
        score_msg: score_info,
        dashboardpage_msg: 'game'
      });
    }
    //Rank
    else if (params.act == 'rank') {
      res.render('dashboard', {
        title: user_info + "'s Dashboard",
        user_msg: user_info,
        icon_msg: 'images/icon/' + icon_info,
        number1_username_msg: number1_info_username,
        number1_score_msg: number1_info_score,
        number1_icon_msg: number1_info_icon,
        number2_username_msg: number2_info_username,
        number2_score_msg: number2_info_score,
        number2_icon_msg: number2_info_icon,
        number3_username_msg: number3_info_username,
        number3_score_msg: number3_info_score,
        number3_icon_msg: number3_info_icon,
        number4_username_msg: number4_info_username,
        number4_score_msg: number4_info_score,
        number4_icon_msg: number4_info_icon,
        number5_username_msg: number5_info_username,
        number5_score_msg: number5_info_score,
        number5_icon_msg: number5_info_icon,
        number6_username_msg: number6_info_username,
        number6_score_msg: number6_info_score,
        number6_icon_msg: number6_info_icon,
        number7_username_msg: number7_info_username,
        number7_score_msg: number7_info_score,
        number7_icon_msg: number7_info_icon,
        number8_username_msg: number8_info_username,
        number8_score_msg: number8_info_score,
        number8_icon_msg: number8_info_icon,
        number9_username_msg: number9_info_username,
        number9_score_msg: number9_info_score,
        number9_icon_msg: number9_info_icon,
        number10_username_msg: number10_info_username,
        number10_score_msg: number10_info_score,
        number10_icon_msg: number10_info_icon,
        dashboardpage_msg: 'rank'
      });
    }

    //Contact
    else if (params.act == 'contact') {
      res.render('dashboard', {
        title: user_info + "'s Dashboard",
        user_msg: user_info,
        icon_msg: 'images/icon/' + icon_info,
        dashboardpage_msg: 'contact'
      });
    }


  


});

//set email
router.post('/email', function (req, res, next) {


  if (req.body.email) {
    let newemail = req.body.email;

    User.query(checkemail, [newemail], function (err, match) {
      if (match.length == 0) {
        User.query(updateemail, [newemail, user_info], function (err, result) {
          email_info = newemail;
          res.redirect('dashboard?act=profile');
        })
      } else {
        res.redirect('dashboard?act=profile');
      }
    })
  }

})

//upload icon
router.post('/icon', function (req, res, next) {

  upload(req, res, (err) => {

    if (req.file) {
      User.query(deleteicon, [user_info], function (err, result) {
        User.query(inserticon, [user_info, req.file.filename, req.file.mimetype, req.file.size, req.file.path], function (err, result) {
          icon_info = req.file.filename;
          User.query(checkrank, function (err, result) {

            if (result[0]) {
              number1_info_username = result[0].username;
              number1_info_score = result[0].highestscore;
              User.query(checkicon, [number1_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number1_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number1_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[0]) {
              number1_info_username = '/';
              number1_info_score = '/';
              number1_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[1]) {
              number2_info_username = result[1].username;
              number2_info_score = result[1].highestscore;
              User.query(checkicon, [number2_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number2_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number2_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[1]) {
              number2_info_username = '/';
              number2_info_score = '/';
              number2_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[2]) {
              number3_info_username = result[2].username;
              number3_info_score = result[2].highestscore;
              User.query(checkicon, [number3_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number3_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number3_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[2]) {
              number3_info_username = '/';
              number3_info_score = '/';
              number3_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[3]) {
              number4_info_username = result[3].username;
              number4_info_score = result[3].highestscore;
              User.query(checkicon, [number4_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number4_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number4_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[3]) {
              number4_info_username = '/';
              number4_info_score = '/';
              number4_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[4]) {
              number5_info_username = result[4].username;
              number5_info_score = result[4].highestscore;
              User.query(checkicon, [number5_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number5_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number5_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[4]) {
              number5_info_username = '/';
              number5_info_score = '/';
              number5_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[5]) {
              number6_info_username = result[5].username;
              number6_info_score = result[5].highestscore;
              User.query(checkicon, [number6_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number6_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number6_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[5]) {
              number6_info_username = '/';
              number6_info_score = '/';
              number6_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[6]) {
              number7_info_username = result[6].username;
              number7_info_score = result[6].highestscore;
              User.query(checkicon, [number7_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number7_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number7_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[6]) {
              number7_info_username = '/';
              number7_info_score = '/';
              number7_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[7]) {
              number8_info_username = result[7].username;
              number8_info_score = result[7].highestscore;
              User.query(checkicon, [number8_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number8_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number8_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[7]) {
              number8_info_username = '/';
              number8_info_score = '/';
              number8_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[8]) {
              number9_info_username = result[8].username;
              number9_info_score = result[8].highestscore;
              User.query(checkicon, [number9_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number9_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number9_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[8]) {
              number9_info_username = '/';
              number9_info_score = '/';
              number9_info_icon = 'images/icon/' + 'default.jpg';
            }
            if (result[9]) {
              number10_info_username = result[9].username;
              number10_info_score = result[9].highestscore;
              User.query(checkicon, [number10_info_username], function (err, icon) {
                if (icon.length > 0) {
                  number10_info_icon = 'images/icon/' + icon[0].name;
                } else {
                  number10_info_icon = 'images/icon/' + 'default.jpg';
                }
              })
            }
            if (!result[9]) {
              number10_info_username = '/';
              number10_info_score = '/';
              number10_info_icon = 'images/icon/' + 'default.jpg';
            }

          })
        })
      })
    }


    res.redirect('dashboard?act=profile');

  });
})

//reset password
router.post('/resetpw', function (req, res, next) {

  if (req.body.password) {
    let newpassword = req.body.newpassword1;
    let password = req.body.password;
    User.query(checkusername, [user_info], function (err, result) {
      bcrypt.compare(password, result[0].password, function (err, match) {
        if (match) {
          bcrypt.compare(newpassword, result[0].password, function (err, same) {

            if (!same) {
              bcrypt.hash(newpassword, saltRounds).then(function (hash) {
                User.query(updatepw, [hash, user_info], function (err, result) {
                  req.flash('success_msg', 'You are successfully reset the password');
                  res.redirect('dashboard?act=resetpw');
                })
              });
            } else {
              req.flash('error', 'The password cannot be the same as before');
              res.redirect('dashboard?act=resetpw');
            }
          })

        } else {
          req.flash('error', 'Wrong Password');
          res.redirect('dashboard?act=resetpw');
        }
      })
    })

  }
})

//Save game data
router.post('/game', function (req, res, next) {
  let playerdata = req.body.highestscore;
  User.query(deletescore, [user_info], function (err, result) {
    User.query(insertscore, [user_info, playerdata], function (err, result) {
      score_info = playerdata;
      User.query(checkrank, function (err, result) {

        if (result[0]) {
          number1_info_username = result[0].username;
          number1_info_score = result[0].highestscore;
          User.query(checkicon, [number1_info_username], function (err, icon) {
            if (icon.length > 0) {
              number1_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number1_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[0]) {
          number1_info_username = '/';
          number1_info_score = '/';
          number1_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[1]) {
          number2_info_username = result[1].username;
          number2_info_score = result[1].highestscore;
          User.query(checkicon, [number2_info_username], function (err, icon) {
            if (icon.length > 0) {
              number2_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number2_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[1]) {
          number2_info_username = '/';
          number2_info_score = '/';
          number2_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[2]) {
          number3_info_username = result[2].username;
          number3_info_score = result[2].highestscore;
          User.query(checkicon, [number3_info_username], function (err, icon) {
            if (icon.length > 0) {
              number3_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number3_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[2]) {
          number3_info_username = '/';
          number3_info_score = '/';
          number3_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[3]) {
          number4_info_username = result[3].username;
          number4_info_score = result[3].highestscore;
          User.query(checkicon, [number4_info_username], function (err, icon) {
            if (icon.length > 0) {
              number4_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number4_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[3]) {
          number4_info_username = '/';
          number4_info_score = '/';
          number4_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[4]) {
          number5_info_username = result[4].username;
          number5_info_score = result[4].highestscore;
          User.query(checkicon, [number5_info_username], function (err, icon) {
            if (icon.length > 0) {
              number5_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number5_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[4]) {
          number5_info_username = '/';
          number5_info_score = '/';
          number5_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[5]) {
          number6_info_username = result[5].username;
          number6_info_score = result[5].highestscore;
          User.query(checkicon, [number6_info_username], function (err, icon) {
            if (icon.length > 0) {
              number6_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number6_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[5]) {
          number6_info_username = '/';
          number6_info_score = '/';
          number6_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[6]) {
          number7_info_username = result[6].username;
          number7_info_score = result[6].highestscore;
          User.query(checkicon, [number7_info_username], function (err, icon) {
            if (icon.length > 0) {
              number7_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number7_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[6]) {
          number7_info_username = '/';
          number7_info_score = '/';
          number7_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[7]) {
          number8_info_username = result[7].username;
          number8_info_score = result[7].highestscore;
          User.query(checkicon, [number8_info_username], function (err, icon) {
            if (icon.length > 0) {
              number8_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number8_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[7]) {
          number8_info_username = '/';
          number8_info_score = '/';
          number8_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[8]) {
          number9_info_username = result[8].username;
          number9_info_score = result[8].highestscore;
          User.query(checkicon, [number9_info_username], function (err, icon) {
            if (icon.length > 0) {
              number9_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number9_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[8]) {
          number9_info_username = '/';
          number9_info_score = '/';
          number9_info_icon = 'images/icon/' + 'default.jpg';
        }
        if (result[9]) {
          number10_info_username = result[9].username;
          number10_info_score = result[9].highestscore;
          User.query(checkicon, [number10_info_username], function (err, icon) {
            if (icon.length > 0) {
              number10_info_icon = 'images/icon/' + icon[0].name;
            } else {
              number10_info_icon = 'images/icon/' + 'default.jpg';
            }
          })
        }
        if (!result[9]) {
          number10_info_username = '/';
          number10_info_score = '/';
          number10_info_icon = 'images/icon/' + 'default.jpg';
        }

      })
      res.redirect('dashboard?act=game');
    })
  })

})

router.get('/logout', function (req, res) {
  user_info = undefined;
  req.logout();
  req.flash('success_msg', 'You are successfully logged out');
  res.redirect('/users/login');
});





module.exports = router;