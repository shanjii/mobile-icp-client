const express = require('express');
const bodyParser = require('body-parser');
const { keyboard, Key } = require('@nut-tree/nut-js');
const tcp = require('tcp-port-used');
const app = express()

const port = 3000
keyboard.config.autoDelayMs = 0;

async function main() {
  app.use(bodyParser.json());

  app.post('/action', createPost);

  const isUsed = await checkPort();

  if (isUsed) {
    console.log(`Port: ${port} is in use, unable to start server`);
    setInterval(() => { }, 1000);
  } else {
    console.log("Port available, starting server...")
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`)
    })
  }
}

main();

function createPost(req, res) {
  const modifier = req.body.modifier;
  const key = req.body.key;
  var modifierKey;

  switch (modifier) {
    case "shift":
      modifierKey = Key.LeftShift;
      break;
    case "ctrl":
      modifierKey = Key.LeftControl;
      break;
    case "alt":
      modifierKey = Key.LeftAlt;
      break;
    default:
      if (key == null) return res.sendStatus(500);
  }

  action(key, modifierKey);
  res.sendStatus(200);
}

function action(key, modifier) {
  if (modifier != null) keyboard.pressKey(modifier);
  keyboard.type(key);
  if (modifier != null) keyboard.releaseKey(modifier);
  console.log("Action received!");
}

async function checkPort() {
  return await tcp.check(3000, 'localhost').catch((err) => {
    console.log(err);
  });
}
