require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messagesCtrl = require('./messagesCtrl');
const session = require('express-session');

const app = express();

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use((req, res, next) => {
  let badWords = ['knucklehead', 'jerk', 'internet explorer'];
  if (req.body.message) {
    let badWordsExist = true;
    for (let i = 0; i < badWords.length; i++) {
      let regex = new RegExp(badWords[i], 'g');
      req.body.message = req.body.message.replace(regex, '****');
    }
    next()
  } else {
    next();
  }
});

app.get('/api/messages', messagesCtrl.getAllMessages);
app.get('/api/messages/history', messagesCtrl.history);
app.post('/api/messages', messagesCtrl.createMessage);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}.`);
});