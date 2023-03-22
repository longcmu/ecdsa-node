const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04acdd3e295e0e54a86f820fa1ebdd8dfb8cf25ce8289585981ce894dfaa496ebe71186da444d29b0ec51617f1ebad13d4afedb33408055c72c24d60ba66ba08ee": 100,
  "040ba488f66e5df8eedbb14e0c060d26bf1071c706b4d702708e00927004bae7298dd493128b425327ba0ddc0b01c84bf26d8cb66e839344e77f0a75c5795f80ee": 50,
  "048bd68ec67fd8a9fdcf466c203042a0718c06c0bb1b87d360bb6d919f010ec9a945d0d55a2ae768c4694dd6d57795a2b624696ba7af97a10cd7cffb771d04e828": 75,
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

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
