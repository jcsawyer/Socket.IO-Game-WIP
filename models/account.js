var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var allFields = 'id salt hash username email activated actCode role socketId';

var account = new Schema( {
	username: { type: String, required: true, index: { unique: true } },
	email: { type: String, required: true, index: { unique: true } },
	activated: Boolean,
	actCode: String,
	role: Number,
	socketId: String
} );

account.statics.findByName = function (name, callback) {
	return this.findOne({ username: name }, allFields, callback);
};

account.statics.findByEmail = function (email, callback) {
	return this.findOne({ email: email }, allFields, callback);
};

account.statics.activate = function (actCode, callback) {
	return this.findOneAndUpdate({ 'actCode' : actCode }, { activated: true }, callback);
}

account.plugin(passportLocalMongoose/*, { usernameQueryFields : ['username'] }*/);

module.exports = mongoose.model('account', account);