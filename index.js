const http = require("http");
const url = require("url");
const QRCode = require("qrcode");

require("dotenv").config();

const BASE_QR_CODE_URL = "/generate-qr";

const QR_CODE_SERVER_USER = process.env.QR_CODE_SERVER_USER ?? "admin";
const QR_CODE_SERVER_PASSWORD = process.env.QR_CODE_SERVER_PASSWORD ?? "admin";

const qrCodeRoutes = {
  [BASE_QR_CODE_URL]: "",
};

function checkCredentials(req) {
  const auth = req.headers["authorization"];

  if (!auth) {
    return false;
  }

  const [username, password] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");
  return (
    username === QR_CODE_SERVER_USER && password === QR_CODE_SERVER_PASSWORD
  );
}

function generateQRCodeOptionsRoute(res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  const html = `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Route options</title>
  </head>
  <body>
      <ul>
      ${Object.keys(qrCodeRoutes)
        .map(function (route) {
          return `<li><a href="${route}">${route}</a></li>`;
        })
        .join("")}
      </ul>
  </body>
  </html>
`;

  res.end(html);
}

function registerQRCodeRoute(client) {
  client.on("qr", (qr) => {
    let route = BASE_QR_CODE_URL;

    if (!!client?.authStrategy?.clientId) {
      route = `${route}/${new String(client.authStrategy.clientId).match(/\d+/g)}`;
    }

    qrCodeRoutes[route] = qr;

    console.log("REGISTERED ROUTE || ", route);
  });
}

function raise404(res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

function qrCodeRoute(route, res) {
  const qrCode = qrCodeRoutes[route];

  QRCode.toDataURL(qrCode, { errorCorrectionLevel: "H" }, function (err, url) {
    if (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error generating QR code");
    } else {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(Buffer.from(url.split(",")[1], "base64"));
    }
  });
}

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (!checkCredentials(req)) {
    res.writeHead(401, { "WWW-Authenticate": 'Basic realm="MyServer"' });
    res.end("Access Denied");

    return;
  }

  try {
    if (reqUrl.path.includes(BASE_QR_CODE_URL)) {
      qrCodeRoute(reqUrl.path, res);
    } else if (reqUrl.path === "/") {
      generateQRCodeOptionsRoute(res);
    } else {
      raise404(res);
    }
  } catch (e) {
    raise404(res);
  }
});

function runQRCodeServer() {
  const port = process.env?.QR_CODE_SERVER_PORT ?? 3000;
  server.listen(port, () => {
    console.log(`QR code server running`);
  });
}

module.exports = {
  runQRCodeServer,
  registerQRCodeRoute,
};
