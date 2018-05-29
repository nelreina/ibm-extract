const unirest = require('unirest');
module.exports = (url, options = {}) =>
  new Promise((resolve, reject) => {
    const { method, query, body } = options;
    const req = unirest(method || 'GET', url);
    if (query) {
      req.query(query);
    }
    const headers = { 'Cache-Control': 'no-cache' };

    if (method === 'POST') {
      if (!body) return reject({ message: 'You must provide a body' });
      headers['Content-Type'] = 'application/json';
      req.headers(headers);
      req.type('json');
      req.send(body);
    } else {
      req.headers(headers);
    }

    req.end(function(res) {
      if (res.error) reject(res.error);

      resolve(res.body);
    });
  });
