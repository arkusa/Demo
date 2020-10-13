const fs = require('fs');
const path = require('path');
const urlUtil = require('url');

const assets = {
  '/': path.resolve(__dirname, '../assets/http.html'),
  '/favicon.ico': path.resolve(__dirname, '../assets/github.png'),
  '/js/common.js': path.resolve(__dirname, '../assets/js/common.js'),
};

function routerHandler(req, res) {
  const { url } = req;

  if (assets[url]) {
    const rs = fs.createReadStream(assets[url]);
    rs.pipe(res);
  }

  if (/\/update\/count/.test(url)) {
    const { query: { count } } = urlUtil.parse(url, true);

    setTimeout(() => {
      res.end(JSON.stringify({
        count,
      }));
    }, count % 3 * 1000); // eslint-disable-line
  }
}

module.exports = routerHandler;
