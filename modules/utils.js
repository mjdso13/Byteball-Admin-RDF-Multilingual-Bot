'use strict';
var utils = 
{
	// text if it's a parametric command
	isParametricRequest (
		request // command to test
	) {
		return request.includes('#');  

	}, 	
	
	// parse user request and return command
	getCmd (
		request // command to parse
	) {
		// return all string (command) until # character (# isn't include)
		return request.substring(0, request.indexOf('#')); 
	}, 

	// parse user request and return parameter
	getParameter (
		request // command to parse
	) {
		// return all string (parameter) after # character (# isn't include)
		return request.substring(request.lastIndexOf("#") + 1); 
	}
};
// export the functions
module.exports = utils;
