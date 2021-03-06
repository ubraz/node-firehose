var util = require("util");
var Store = require("./base").Store;
var User = require("../user/base").User;

/**
 * File based user storage
 * 
 */
function JsonFileStore(config) {
	Store.call(this, config);
	
	//Users
	this.users = require(config.path);
}
util.inherits(JsonFileStore, Store);

/**
 * Check a credentials object to see if it has passed authentication
 */
JsonFileStore.prototype.getUserFromCredentials = function(credentials, callback) {
	//Check the credentials exist
	if (!credentials.username || !credentials.password) {
		return callback(new Error("Username and password are required"));
	}
	
	//Get user based on user id
	var item = null;
	this.users.forEach(function(userItem){
		if (userItem.username.toLowerCase() === credentials.username.toLowerCase()) {
			item = userItem;
		}
	});
	
	//Check for null user
	if (item === null) {
		return callback(new Error("Username not found"));
	}
	
	//Check the password is correct
	if (item.password !== credentials.password) {
		return callback(new Error("Password is incorrect"));
	}
	
	//Create a user
	var user = new User();
	user.setId(new Date().getTime().toString());
	user.setCredentials(credentials);
	
	//Return the credentials as that is all we know about the user
	callback(undefined, user);
};

module.exports = {
	Store: JsonFileStore
};
