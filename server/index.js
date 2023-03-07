const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const hashMessage = require("./hashMessage");
const { toHex } = require("ethereum-cryptography/utils");

async function recoverKey(message, signature, recoveryBit) {
  const hashedMessage = hashMessage(message);
  try {
    return secp.recoverPublicKey(hashedMessage, signature, recoveryBit);
  } catch (err) {
    console.log(err);
  }
}

app.use(cors());
app.use(express.json());

const publicKeys = {
  "7c87c31a306342c84a14f196fbf9931fd27472fb":
    "04f562f56a470ef86facb9f9e1d775cbadffd1cc17d8d14ef1213d24adadc00314ea66165e15d9cf5e86ad8d227f8a449cd8a5c6dbfca3a797dd833f509d393dd8",
  "7fabf57fea536022befd1fc5e5ec43c22dc904af":
    "04fa7095e45307d077e3c939c48292b93621f8ca7ac8c967e0c5be8b116c927efa477af6f4dd0babb3b9b17c9fae8b0cca7866641184a1a77ba360b6702c74ef24",
  "619562f9fa10cf1dfd1161cb73c9b520b791e995":
    "048d6a3a62919d20cb07a7e18687fa40abd12edce5c9692c5759cff6e1224271844adf0359fc487302fdaa209905a9e7fd329939b09fd2e9db886ba865c16bb638",
  "2ea60e836ba31dbcf7502ad1f5a1addb029b11ff":
    "04b2d2d72ed244149f2b67a3e2b0fc7fcf516574ac06b05eaa2a9cbaa2fecd303840fe3c3a9672422bfe3333270de151b8c8bb4039db7f6627ae685d655a41a4eb",
  "70f30f6c621ec34df617b6a9b553f1f84d1d47f9":
    "0463ffed1ec9386d5b3b6ee09d5a4e7b2b8955913925bcc63ea0efc1196406a81a77aded37c73e98478986b7b16039829214d28af7e24b423afe9181437f6eaf60",
  "4b395563a2fb2e9649c5513a5203eda725b251d7":
    "0471b359095f3116b331c7b4eb2759db6cea5cd86c3791b00bceae1ab05e8b72feb3d1c518465e6c6fa88c5d1cec0dd49cbf097d6cb6bf3f76851064deb9b7cf11",
};

const balances = {
  "7c87c31a306342c84a14f196fbf9931fd27472fb": 100,
  "7fabf57fea536022befd1fc5e5ec43c22dc904af": 50,
  "619562f9fa10cf1dfd1161cb73c9b520b791e995": 75,
  "2ea60e836ba31dbcf7502ad1f5a1addb029b11ff": 10,
  "70f30f6c621ec34df617b6a9b553f1f84d1d47f9": 30,
  "4b395563a2fb2e9649c5513a5203eda725b251d7": 15,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/verify/:address/:signature/:recoveryBit", (req, res) => {
  const { address } = req.params;
  const { signature } = req.params;
  const { recoveryBit } = req.params;

  let recoveredPublicKey = null;
  recoverKey(address.trim(), signature.trim(), Number(recoveryBit)).then(
    (publicKey) => {
      recoveredPublicKey = publicKey;
      recoveredPublicKey = toHex(recoveredPublicKey);
      const storedPublicKey = publicKeys[address] || 0;
      let balance = "INPUT VALID CREDENTIALS";
      if (recoveredPublicKey && recoveredPublicKey === storedPublicKey) {
        balance = balances[address] || "INPUT VALID CREDENTIALS";
        res.send({ balance });
      } else {
        res.send({ balance });
      }
    }
    // (reason) => {
    //   console.log(reason);
    // }
  );
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
