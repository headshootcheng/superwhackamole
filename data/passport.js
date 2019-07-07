let LocalStrategy = require('passport-local').Strategy;
let bcrypt=require('bcryptjs');

let User = require('./account');

let passport = function (passport) {
    passport.use('login',
        new LocalStrategy({
            usernameField:'username'
        }, function (username, password, done) {
            let checkusername = `SELECT * FROM account WHERE username=?`

            User.query(checkusername, [username], function (err, result) {
                if (result.length > 0) {
                    bcrypt.compare(password, result[0].password, function (err, match) {
                        if (err) throw err;
                        if (match) {
                            return done(null, result,{message:username});
                        } else {
                            return done(null, false, { message: 'Wrong Password'});
                        }
                    });
                } else {
                    return done(null, false, {message: 'Wrong Username'});
                }

            })
        })
    );
    
 

    passport.serializeUser(
        function (user, done) {
            done(null, user[0].id);
        });

    passport.deserializeUser(
        function (id, done) {
            let checkid = `SELECT * FROM account WHERE id=?`
            User.query(checkid, [id], function (err, result) {
                done(err, result[0]);
            });
        });

}

module.exports=passport;