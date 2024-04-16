# WhatsappJS QRCode Page

This library is a utility for WhatsAppWeb.js that simplifies the process of displaying the WhatsApp QR code on web pages. It provides a straightforward and easy-to-integrate solution for web developers looking to connect their applications with WhatsApp using the WhatsAppWeb.js library.

### Usage

When a `Client` instance is initialized using `whatsapp-web.js`, the library will register a route for each client. You can access the QR code for each client by navigating to the appropriate route as described above. This functionality facilitates easy management and access to multiple WhatsApp sessions from a single server.

### Endpoints

- **Default QR Code**:

  - **Path**: `/generate-qr`
  - **Description**: If no specific WhatsApp number is provided, this route will display the QR code for the default initialized client.

- **Generate QR Code**:

  - **Path**: `/generate-qr/${whatsappNumber}`
  - **Description**: Generates and displays the QR code for the specified WhatsApp number. Replace `${whatsappNumber}` with the actual WhatsApp number associated with a client.
  - **Example**: Accessing `/generate-qr/1234567890` will display the QR code for the WhatsApp number 1234567890.

- **List Registered Routes**:
  - **Path**: `/`
  - **Description**: This route lists all the registered QR code routes available for different initialized clients.

## Example

```js
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
```

## Accessing the QR Code Page

When accessing the QR code display pages, you will be prompted to enter the credentials. Use the values set for QR_CODE_SERVER_USER and QR_CODE_SERVER_PASSWORD. If you have changed the port, make sure to access the server using the new QR_CODE_SERVER_PORT.

## Security

The QR code display pages are protected with basic authentication to ensure secure access. Enter the credentials when prompted to secure your QR code access.

## Configuration

To customize the settings of the QR code server, you can use the following environment variables:

### Environment Variables

- `QR_CODE_SERVER_USER`: Username for the QR code server authentication. Default is "admin".
- `QR_CODE_SERVER_PASSWORD`: Password for the QR code server authentication. Default is "admin".
- `QR_CODE_SERVER_PORT`: Port on which the QR code server runs. Default is 3000.

## Support

For support, email lmgomes96@gmail.com or open an issue in the GitHub repository.
