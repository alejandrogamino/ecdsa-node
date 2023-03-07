const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

createAccount();

async function createAccount() {
  const privateKey = secp.utils.randomPrivateKey();
  console.log("private key: ", toHex(privateKey));

  const publicKey = secp.getPublicKey(privateKey);
  console.log("public key: ", toHex(publicKey));

  const address = keccak256(publicKey.slice(1)).slice(-20);
  console.log("address: ", toHex(address));

  const hashedAddress = hashMessage(toHex(address));

  const [signature, recoveryBit] = await secp.sign(hashedAddress, privateKey, {
    recovered: true,
  });

  console.log("Signature: ", toHex(signature));
  console.log("Recovery Bit: ", recoveryBit);
}

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
}
