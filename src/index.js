'use strict';

var http = require('http');
var request = require('request');
const Alexa = require('alexa-sdk');
let APP_ID = 'amzn1.ask.skill.{myuniquekey}';

const handlers = {
	'LaunchRequest': function () {
		// If the user either does not reply to the welcome message or says something that is not
		// understood, they will be prompted again with this text.        
		var outputSpeech = '"Welcome to Tornado Alley. Using this skill you can be better informed and prepared for Tornadoes near you. You can say whats happening.';
		var repromptSpeech = 'You can say which cities are supported.';

		this.emit(':ask', outputSpeech, repromptSpeech);
	},
	'MyAreaIntent': function () {
		var deviceId = this.event.context.System.device.deviceId;
		var consentToken = this.event.context.System.user.permissions.consentToken;

		getDeviceLocation(deviceId, consentToken, function (postal, err) {
			if (err) {
				this.emit(':tell', 'There was an error completing your request.');
			}
			else {
				this.emit("tell:", "Postal code is " + postal);
			}

		});

	},
	'YesIntent': function () {
		var speechOutPut = "test";
		this.emit(':tell', speechOutPut);
	},
	'HelpIntent': function () {
		var speechOutPut = "test";
		this.emit(':tell', speechOutPut);
	}
};

exports.handler = (event, context, callback) => {
	var alexa = Alexa.handler(event, context);

	alexa.appId = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};


function getDeviceLocation(deviceId, consentToken, callback) {
	var url = "https://api.amazonalexa.com/v1/devices/" + deviceId + "/settings/address/countryAndPostalCode";
	var options =
    {
    	url: url,
    	headers: {
    		'Access-Control-Allow-Origin': '*',
    		'Authorization': 'Bearer ' + consentToken,
    	}
    };



	var req = http.get(options, function (res) {
		var body = "";
		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
			//body = body.replace(/\\/g,'');
			var postal = JSON.parse(body);
			callback(postal.postalCode)
		})

	});

	req.on('error', function (err) {
		callback('', err);
	});

};

