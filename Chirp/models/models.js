var mongoose = require('mongoose');
module.exports = function(){
	var userSchema = new mongoose.Schema({
		username: String,
		password: String, //hash created from password
		created_at: {type: Date, default: Date.now}
	});

	mongoose.model('User', userSchema);

	var postSchema = new mongoose.Schema({
		created_by: { type: mongoose.Schema.ObjectId, ref: 'User' },
		created_at: {type: Date, default: Date.now},
		text: String
	});

	mongoose.model('Post', postSchema);

}
