const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config');
const Queue = require('./src/Queue/Queue');

const app = express();
app.use(bodyParser.json());
const qqQueue = new Queue(config);

app.get('/web', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/status', (req, res) => {
  res.json(qqQueue.status());
});

app.post('/add', (req, res) => {
  res.json(qqQueue.add(req.body.message));
});

app.get('/get', (req, res) => {
  res.json(qqQueue.get());
});

app.post('/delete', (req, res) => {
  res.json(qqQueue.delete(req.body.messageId));
});

app.post('/purge', (req, res) => {
  res.json(qqQueue.purge());
});

app.listen(3000, '127.0.0.1', (err) => {
  if (err) {
    console.log('Failed to start qq queue:', err);
    return process.exit(1);
  }

  console.log('Started qq queue on port:', 3000);
});
