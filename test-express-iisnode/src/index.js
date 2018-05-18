const express = require('express');
const bp = require('body-parser');
let port = process.env.PORT;
if (!port) {
  port = process.argv[2];
}

const app = express();
app.use(bp.json());
app.get('/', (req, res) => {
  res.send('Hallo from iisnode with express  src/index');
});
app.post('/', (req, res) => {
  console.info(JSON.stringify(req.body));
  res.send(req.body);
});

app.listen(port, () => {
  console.info(`app listen to port ${port}`);
});
