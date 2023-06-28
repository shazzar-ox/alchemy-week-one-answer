const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require('ethereum-cryptography/utils')
const sha256 = require('js-sha256').sha256;
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "f8e47112663b83e20e2bd3a93bf843a0ea8b4f9cd2e7746e43cd245bb7da7b49": 100,
  "b46aba676da9300b69c03adbb1f765ad923b0517cd03e4de9db3567f92b10ce5": 50,
  "049b7ea871c9aae970089ffe9b71f0dff83f66b21a2a80464d00d99c8f21e597": 75,
  "ox1": 30,
  "ox2": 30
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});



app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  const message = sha256([recipient, amount])
  const publicKey = toHex(secp256k1.getPublicKey(sender))
  // message consists of all the data you are to send 
  // signature takes in a message and a private key
  const signature = secp256k1.sign(message, sender)
  // veryify takes in signature message public key
  const isSigned = secp256k1.verify(signature, message, publicKey)
  if (isSigned) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: 'Invalid Signature' })
  }


});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
