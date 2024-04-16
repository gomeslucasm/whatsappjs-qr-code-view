const { Client } = require("whatsapp-web.js");
const { runQRCodeServer, registerQRCodeRoute } = require("../server");

function run() {
  // Create a new client instance
  const client = new Client();

  // When the client is ready, run this code (only once)
  client.once("ready", () => {
    console.log("Client is ready!");
  });

  registerQRCodeRoute(client);

  // Start your client
  client.initialize();

  runQRCodeServer();
}

run();
