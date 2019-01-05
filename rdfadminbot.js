'use strict';
// load Byteball libraries
const conf = require('byteballcore/conf.js');
const eventBus = require('byteballcore/event_bus.js');
// useful to pause the terminal
const headlessWallet = require('headless-byteball');
const wallet = require('byteballcore/wallet.js');
const device = require('byteballcore/device.js');
//load modules
const i18nRDF = require('./modules/i18nRDF');
const admin = require('./modules/adminUtils');
const utils = require('./modules/utils');

// pairing initialization
eventBus.on (
	'paired', 
	function (from_address, pairing_secret) {
		// set initial language interface
		i18nRDF.setLanguage(conf.default_language, from_address);
		// send welcome message to user
		device.sendMessageToDevice (
			from_address, 
			'text',
			i18nRDF.getText('welcome', from_address) + // welcome message 
			i18nRDF.getText('menu', from_address) + // user menu
			((admin.isAdministrator(from_address)) // if user is admin 
				? i18nRDF.getText('adminMenu', from_address) : '') // // add admin menu 
		);
	}
);

// process user requests
eventBus.on (
	'text', 
	function (from_address, text) {
		var cmd = text; // initiate command variable
		
		if (utils.isParametricRequest(cmd)) { // test if it's a parametric command
			switch (utils.getCmd(cmd)) { // extract command as switch selector
				case 'setLanguage' :  // change the user interface language 
					// if language exists obviously
					if (i18nRDF.availableLanguages(utils.getParameter(cmd))) {
						// set language interface
						i18nRDF.setLanguage(utils.getParameter(cmd), from_address);
						cmd = 'languageChanged'; // mark as language changed
					} else { cmd = 'unknownLanguage'; } // else it's an unknown language
					break;
				case 'admin' : // test if it's an admin and if option is available
					cmd = (admin.isAdministrator(from_address) && // if admin and if
						admin.availableOptions(utils.getParameter(cmd))) ? // parameter exists
						'admin' : 'unknownCmd';
					break;
				default : // by default, all parametric commands
					cmd = 'unknownCmd';
			}
		}
		// synchronous message or not
		var isSynchronous = true;
		// prepare message
		var preparedMessage = '';
		switch (cmd) {
			case 'main':
				preparedMessage = i18nRDF.getText(cmd, from_address);
				break;
			case 'explain':
				preparedMessage = i18nRDF.getText(cmd, from_address);
				break;
			case 'languages':
				preparedMessage = i18nRDF.getText(cmd, from_address);
				break;
			case 'languageChanged':
				preparedMessage = i18nRDF.getText(cmd, from_address);
				break;
			case 'unknownLanguage':
				preparedMessage = i18nRDF.getFormatted( // format variable text
					i18nRDF.getText(cmd, from_address), // text
					[utils.getParameter(text)] // parameter
				);
				break;
			case 'admin':
				preparedMessage = i18nRDF.getFormatted( // format variable text
					i18nRDF.getText("unknownCmd", from_address), // text
					[utils.getParameter(text)] // parameter
				);
				if (admin.isAdministrator(from_address)) {
					var parameter = utils.getParameter(text);
					if (admin.availableOptions(parameter)) {// option exists
						admin.executeAdminOption(parameter, i18nRDF);// execute command
						isSynchronous = false;
					}
					parameter = '';
				}
				break;
			// add your new sentence here
			default:
				preparedMessage = i18nRDF.getFormatted( // format variable text
					i18nRDF.getText("unknownCmd", from_address), // text
					[utils.getParameter(text)] // parameter
				);
		}
		// send message to user
		if (isSynchronous) {
			device.sendMessageToDevice (
				from_address, 
				'text',
				preparedMessage + i18nRDF.getText('menu', from_address)  +
					((admin.isAdministrator(from_address)) // if user is admin 
						? i18nRDF.getText('openAdminMenu', from_address) : '') // // add menu 
			);
		}
		// clear from memory
		cmd = preparedMessage = isSynchronous = '';
	}
);
