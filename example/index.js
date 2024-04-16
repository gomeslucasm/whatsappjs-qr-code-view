const { Client } = require("whatsapp-web.js");
const {
  runQRCodeServer,
  registerQRCodeRoute,
} = require("whatsappjs-qr-code-view");

function run() {
  const client = new Client();

  client.once("ready", () => {
    console.log("Client is ready!");
  });

  // will register a route for qrcode image when 'qr' event is fired
  registerQRCodeRoute(client);

  client.initialize();

  // will initialize qrcode image server
  runQRCodeServer();
}

run();
