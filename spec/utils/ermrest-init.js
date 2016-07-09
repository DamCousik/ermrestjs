
exports.init = function (options) {
	options = options || {};

	var url = options.url || process.env.ERMREST_URL,
	    authCookie = options.ermrest_cookie || process.env.AUTH_COOKIE;

	var ermRest = require(process.env.PWD + "/build/ermrest.js");

	ermRest.setUserCookie(authCookie);

	console.log(url + " " + authCookie);

	var server = ermRest.ermrestFactory.getServer(url);

	return {
		ermrestUtils: require("ermrest-data-utils"),
		ermRest: ermRest,
		server: server,
		url: url,
		authCookie: authCookie
	};
};