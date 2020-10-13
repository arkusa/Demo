const fs = require('fs');
const path = require('path');
const urlUtil = require('url');

const assets = {
  '/': path.resolve(__dirname, '../assets/http2.html'),
  '/favicon.ico': path.resolve(__dirname, '../assets/github.png'),
  '/js/common.js': path.resolve(__dirname, '../assets/js/common.js'),
};

module.exports = function streamHandler(stream, headers) {
  const url = headers[':path'];

  if (assets[url]) {
    const rs = fs.createReadStream(assets[url]);
    rs.pipe(stream);
  }

  if (/\/update\/count/.test(url)) {
    const { query: { count } } = urlUtil.parse(url, true);

    setTimeout(() => {
      stream.end(JSON.stringify({
        count,
      }));
    }, count % 3 * 1000); // eslint-disable-line
  }
};
