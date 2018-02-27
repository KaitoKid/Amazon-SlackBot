var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');
const fetch = require("node-fetch");
const coin = "https://min-api.cryptocompare.com/data/price?fsym="
const currency = "&tsyms=USD";
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
  fetch(coin + session.message.text + currency)
  .then(response => {
    response.json().then(json => {
      session.send("The current price of " + session.message.text + " is: %s USD", json['USD']);
    });
  })
  .catch(error => {
    console.log(error);
  });
});
