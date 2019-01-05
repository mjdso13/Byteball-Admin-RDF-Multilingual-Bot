'use strict';

const administratorFunctions = require('./admin');

// set admin
function setAdminFromDB() {
	var db = require('byteballcore/db'); // load Byteball DB module
	var row = ''; // initialize key iterator

	db.query( // execute query
		"SELECT device_address AS address \
		FROM paired_device_configuration \
		WHERE device_admin = true", 
		function (rows) { // process query answer
			for (row in rows) { // iterate query answers
				adminAddress = rows[row].address;
			}
		}
	);
	// unload from memeory
	db = row = '';
}

// set admin with environment variable 
var adminAddress = process.env.ADMIN_DEVICE_ADDRESS;
// or/and from database
setAdminFromDB();
// admin options
var adminLabels = [
	'menu', 
	'memoryInfo', 
	'totalUsers', 
	'totalUsersByLanguage',
	'messageToAllConfirmation',
	'sendMessageToAll',
	'reloadRdfConfirmation',
	'reloadRdf'
];
var adminFunctions = {
	"menu" : function (i18n) { administratorFunctions.getMenu(i18n, adminAddress) },
	"memoryInfo" : function (i18n) { administratorFunctions.getMemoryUsage(i18n, adminAddress) }, 
	"totalUsers" : function (i18n) { administratorFunctions.getTotalUsers(i18n, adminAddress) }, 
	"totalUsersByLanguage" : function (i18n) { administratorFunctions.getTotalUsersByLanguages(i18n, adminAddress) },
	"messageToAllConfirmation" : function (i18n) { administratorFunctions.messageToAllConfirmation(i18n, adminAddress) }, 
	"sendMessageToAll" : function (i18n) { administratorFunctions.sendMessageToAll(i18n, adminAddress) }, 
	"reloadRdfConfirmation" : function (i18n) { administratorFunctions.reloadRdfConfirmation(i18n, adminAddress) }, 
	"reloadRdf" : function (i18n) { administratorFunctions.reloadRdf(i18n, adminAddress) }
};

var adminUtils = 
{
	// administrator functions
	isAdministrator (
		userAddress
	) {
		return userAddress === adminAddress;
	},	
	// Is option available
	availableOptions (
		label
	) { 
		return adminLabels.includes(label); 
	} ,
	
	// execute admin functions
	executeAdminOption (
		func,
		parameter
	) { 
		return adminFunctions[func](parameter); 
	}
};
// export the functions
module.exports = adminUtils;
