let express=require('express');
let app=express();
let expresslayouts=require('express-ejs-layouts');
let User = require('./data/account');
let flash=require('connect-flash');
let session=require('express-session');
let passport=require('passport');

require('./data/passport')(passport);
//Connect to databases
User.connect();
//EJS
app.use(expresslayouts);
app.set('view engine','ejs');
app.use('/',express.static('public'));
app.use('/users',express.static('public'));

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: 'Mole',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req,res,next){

	res.locals.success_msg=req.flash('success_msg');
	res.locals.user_msg=req.flash('user_msg');
	res.locals.dashboardpage_msg=req.flash('dashboardpage_msg');
	res.locals.error=req.flash('error');
	res.locals.success=req.flash('success');
	next();
});
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));



app.listen(5000, function () {
	console.log('Server Start');
});