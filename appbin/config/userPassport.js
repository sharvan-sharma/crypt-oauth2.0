const passport =  require('passport');
const User = require('./models/usermodel');


passport.serializeUser((user, done) => {
	console.log('*** serializeUser called, user: ')
	console.log('---------')
    console.log(user.username);
	done(null, { _id: user._id })
});

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
	console.log('DeserializeUser called')
	User.findOne(
		{ _id: id },
		'username',
		(err, user) => {
			console.log('*** Deserialize user, user:')
			console.log(user.username)
			console.log('--------------')
			done(null, user)
		}
	)
});

passport.use(User.createStrategy());


module.exports = passport;