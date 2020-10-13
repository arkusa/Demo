const fs = require('fs');

module.exports = {
  key: fs.readFileSync('./pem/privatekey.pem'),
  cert: fs.readFileSync('./pem/certificate.pem'),
};
