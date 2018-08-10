const c = require('ansi-colors');
const http = require('http');

const app = require('./app');

const server = http.createServer(app);
const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(`Server is up and running on port ${c.cyan(port)}`)
);
