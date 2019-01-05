'use strict';

const rdf = require('./RDFParser');

// load the Byteball database module
var db = require('byteballcore/db');

// query create the table if it doesn't exist
db.query( // execute query
	"CREATE TABLE IF NOT EXISTS paired_device_configuration (\
		device_address CHAR(33) NOT NULL UNIQUE, \
		device_language CHAR(8) NOT NULL, \
		device_admin BOOLEAN NOT NULL\
	)"
);

// query to set an admin device address through environment variables if exists
if (process.env.ADMIN_DEVICE_ADDRESS && process.env.ADMIN_DEVICE_LANGUAGE) {
	db.query( // excute query
		"INSERT OR IGNORE INTO paired_device_configuration (\
			device_address, \
			device_language, \
			device_admin \
		) VALUES (\
			'" + process.env.ADMIN_DEVICE_ADDRESS + "', \
			'" + process.env.ADMIN_DEVICE_LANGUAGE + "', \
			true \
		)"
	);
}

// initialize users' language preference array
var usersLanguage = [];

// query to fill the users' language preference when bot restart
db.query( // execute query
	"SELECT device_address AS address, \
	device_language AS language \
	FROM paired_device_configuration",
	function(rows) { // process query answer
		var row = '';	// initialize key iterator
		for (row in rows) { // iterate
			 // load user language preference into memory
			usersLanguage[rows[row].address] =  rows[row].language;
		}
		row = ''; // unload from memory
	}
);

db = ''; // unload database

// extract the subject subgraph of the RDF data model
var rdfSubGraph = rdf.parseLocalRDF();

// extract IETF language tags of the RDF sub graph
var IETFLanguageTags = rdf.getIETFLanguageTags(rdfSubGraph);

// extract bot messages of the RDF sub graph
var botMessages = rdf.getMessages(rdfSubGraph, IETFLanguageTags);

// clear rdf subgraph of the memory
rdfSubGraph = [];//loadLocalRDF();

// internationalization functions
var i18n = 
{
	// Is language requested available among IETF language tags
	availableLanguages (
		tag
	) { 
		return IETFLanguageTags.includes(tag); 
	} ,

	// set user interface language
	setLanguage (
		language,  // new language
		user // user recipient address
	) {
		// load Byteball database module
		var db = require('byteballcore/db');
		
		// query to update language if user exists
		db.query( // execute query
			"UPDATE paired_device_configuration \
			SET device_language = '" + language + "' \
			WHERE device_address ='" + user + "'"
		);

		// or insert new user in database if user doesn't exist
		db.query( // execute query
			"INSERT OR IGNORE INTO paired_device_configuration (\
				device_address, \
				device_language, \
				device_admin\
			) VALUES (\
				'" + user + "', \
				'" + language + "', \
				false\
			)"
		);

		db = ''; // unload database module

		usersLanguage[user] = language; // set user languages in memory
	} ,

	// get translated text for specific user
	getText (
		text, // text to transalte
		user // user recipient address
	) {
		return botMessages[usersLanguage[user]][text];
	} ,

	// get formatted parametric text
	getFormatted (
		text, // text to format with parameter
		parameter // array of parameters
	) {
			var util = require('util'); // load nodejs util module

			var formatted = text; // copy text to format
			var i = ''; // initialize key iterator

			for (i in parameter) {
				formatted = util.format(formatted , parameter[i]); // format text
			}
			
			util = i = ''; // unload module and erase key iterator

			return formatted; 
	} ,

	// reload rdf file 
	reloadRdf () 
	{
		// extract the subject subgraph of the RDF data model
		var subGraph = rdf.parseLocalRDF();
		// extract IETF language tags of the RDF sub graph
		IETFLanguageTags = rdf.getIETFLanguageTags(subGraph);
		// extract bot messages of the RDF sub graph
		botMessages = rdf.getMessages(subGraph, IETFLanguageTags);
		// clear rdf subgraph of the memory
		subGraph = [];
	}
};
// export the functions
module.exports = i18n;
