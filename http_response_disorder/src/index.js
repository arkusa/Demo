/* eslint-disable */
const http = require('http');
const http2 = require('http2');

const open = require('open');

const port = {  http: 8001, http2: 443 };

const options = require('./pem');
const routerHandler = require('./router.js');
const streamHandler = require('./stream.js');

const server = http.createServer(routerHandler);
const http2Server = http2.createSecureServer(options);

function openChrome(url) {
  open(url, { app: 'google chrome' });
}

server.listen(port.http, openChrome.bind(null, `http://localhost:${port.http}`));

http2Server.on('stream', streamHandler); 
http2Server.on('error', (err) => console.error(err));
http2Server.listen(port.http2, openChrome.bind(null, `https://localhost:${port.http2}`));
