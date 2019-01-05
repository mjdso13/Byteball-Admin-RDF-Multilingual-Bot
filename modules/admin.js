'use strict';

// send data to admin
function sendData(
	data, 
	address
) {
	// load Byteball device module
	var device = require('byteballcore/device.js');
	// send message to device
	device.sendMessageToDevice (
		address, 
		'text',
		data
	);
	// unload module from memory
	device = '';
}

// administrator functions
var administratorFunctions = {
	// get total users registred
	getTotalUsers(i18n, address) {
		// load Byteball database module
		var db = require('byteballcore/db');
		// execute query to database
		db.query(
			"SELECT MAX(_rowid_) AS totalUsers \
			FROM paired_device_configuration", 
			function (rows) { // process query answer

				var row = ''; // initialize key iterator
				var data = i18n.getText("dbContains", address); // set text title

				for (row in rows) {  // iterate
					data += i18n.getFormatted( // format parametric text
						i18n.getText("format_d_colon_s",address), // parametric text translated
						[ // array of parameters
							rows[row].totalUsers, // 1st parameter = total users 
							i18n.getText( // translate 2nd parameter
								rows[row].totalUsers === 1 ? "user" : "users", // plural
								address
							)
						]
					);
				}
				// send data to admin
				sendData(data+i18n.getText("adminMenu",address), address); 
				row = data = ''; // unload from memory
			}
		);
		// unload database
		db = '';
	} , 

	// get total users registred by languages
	getTotalUsersByLanguages(i18n, address) {
		// load Byteball database module
		var db = require('byteballcore/db'); // load DB function
		// execute query
		db.query(
			"SELECT device_language AS language, \
			COUNT(device_language) AS totalByLanguage \
			FROM paired_device_configuration \
			GROUP BY language \
			ORDER BY totalByLanguage \
			DESC", 
			function (rows) { // process query answer

				var row = ''; // initiate key iterator
				var data = i18n.getText("dbContains", address); // translated title

				for (row in rows) { // iterate
					data += i18n.getFormatted( // format parametric text
						i18n.getText("format_s_colon_d_s",address), // parametric text translated
						[ // array of parameters
							rows[row].language, // 1st parameter
							rows[row].totalByLanguage,  // 2nd parameter
							i18n.getText( // translated 3th parameter
								rows[row].totalByLanguage === 1 ? "user" : "users", // plural ? 
								address 
							)
						]
					);
				}
				// send data to admin
				sendData(data+i18n.getText("adminMenu",address), address);
				row = data = ''; // unload from memory
			}
		);
		// unload database
		db = '';
	} , 
	// get memory usage
	getMemoryUsage (i18n, address) {
		var i = ''; // initialize key iterator
		var amount = ''; // initialize amount variable
		var data = i18n.getText("memoryUsage", address); // get tranlated title
		var used = process.memoryUsage(); // get memory usage
		
		for (i in used) { // iterate memory usage parameters
			amount = Math.round(used[i]/1024/1024*100)/100; // compute in memory usage in Megabytes
			data += i18n.getFormatted( // format parametric text
				i18n.getText("format_s_colon_d_s",address), // parametric text translated
				[// array of parameter
					i, // 1st parameter
					amount, // 2nd parameter
					i18n.getText( // 3th parameter translated
						amount<=1.0 ? "mbyte" : "mbytes", // plural ??
						address
					)
				]
			);
		}
		 // send data to admin
		sendData(data+i18n.getText("adminMenu",address), address);
		data = i = used = amount = '';// unload from memory
	} , 

	// confirmation be to send a message to all
	messageToAllConfirmation (i18n, address) {
		sendData(i18n.getText("messageToAllConfirmation",address), address);
	} , 
	// send message to all
	sendMessageToAll (i18n, address) {
		var db = require('byteballcore/db'); // load Byteball database module
		var row = ''; // key iterator

		db.query( // execute query
			"SELECT device_address AS recipient \
			FROM paired_device_configuration \
			WHERE  device_admin = false", 
			function (rows) { // process query answer
				 
				for (row in rows) { // iterate query answers
					// send translated data
					sendData(i18n.getText(
						"messageToAll", // text to translate
						rows[row].recipient // translated for this recipient
					), rows[row].recipient); // send data to this recipient
				}
				// Inform admin that messages have been sent to users
				sendData(i18n.getText("messageToAllSent",address) + 
					i18n.getText("adminMenu",address), address); // set admin menu
			}
		);
		// unload database
		row = db = '';
	} ,
	// confirmation before to reload RDF file
	reloadRdfConfirmation (i18n, address) {		
		sendData(i18n.getText("reloadRdfConfirmation",address), address);
	} ,
	// reload RDF file
	reloadRdf (i18n, address) {
		i18n.reloadRdf();		
		sendData(i18n.getText("reloadRdf",address) + i18n.getText("adminMenu",address), address);
	} ,
	// get menu
	getMenu (i18n, address) {
		sendData(i18n.getText("adminMenu",address), address); // send data to admin
	}
};
// export the functions
module.exports = administratorFunctions;
