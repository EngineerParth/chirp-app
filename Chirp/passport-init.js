var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

//temporary data store - previous implementation
//var users = {};
module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {

		//return done(null, users[username]);

		User.findById(id, function(err, user){
			console.log('Deserializing user: '+ user.username);
			return done(err, user);
		});

	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {

			// Older Implementation using the dictionary
      // if(!users[username]){
			// 	console.log('User Not Found with username '+username);
			// 	return done(null, false);
			// }
			//
			// if(isValidPassword(users[username], password)){
			// 	//sucessfully authenticated
			// 	return done(null, users[username]);
			// }
			// else{
			// 	console.log('Invalid password '+username);
			// 	return done(null, false)
			// }

			// Implementation using mongoDB and mongoose
			User.findOne({'username': username}, function(err, user){

				// If there is an error, return the error
				if(err){
					return done(err);
				}

				// user is not found in the database, return false
				if(!user){
					console.log('user not found with the username: '+ username);
					return done(null, false);
				}

				// Invalid password, return false
				if(!isValidPassword(user, password)){
					console.log('Invalid password');
					return done(null, false);
				}

				// User is found with valid password, return the user object
				return done(null, user);

			});
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

			// Previous implementation using dictionary
      // if(users[username]){
      //   console.log('User already exists with username: '+ username);
      //   return done(null, false);
      // }
      // users[username]={
      //   username: username,
      //   password: createHash(password)
      // };
      // console.log(users[username].username + ' Registration successful');
			// return done(null, users[username]);


			// Implementation using MongoDB collection
			User.findOne({'username':username}, function(err, user){

				// error, send the error object
				if(err){
					console.log('Error in signup: '+ err);
					return done(err);
				}

				// A user already exist in the database, send false
				if(user){
					console.log('User already exists with usename: '+ username);
					return done(null, false);
				}

				// Register new user
				else{
					var nUser = new User(); // create a new empty user object using model
					nUser.username = username;
					nUser.password = createHash(password);

					// Save to the MongoDB collection
					nUser.save(function(err){
						if(err){
							console.log('Error in saving user: '+ err);
							return done(err, false);
						}
						console.log('Registration successful.');
						return done(null, nUser); // return new user on successful registration
					});
				}

			});
		})
	);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
