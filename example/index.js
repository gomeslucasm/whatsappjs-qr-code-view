const { Client } = require("whatsapp-web.js");
const { runQRCodeServer, registerQRCodeRoute } = require("..");

function run() {
  const client = new Client();

  client.once("ready", () => {
    console.log("Client is ready!");
  });

  registerQRCodeRoute(client);

  // Start your client
  client.initialize();

  runQRCodeServer();
}

run();
