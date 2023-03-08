// I use this file to simulate the client signing the transaction offline using his private key

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const prompt = require("prompt-sync")();

const hashedMessage = prompt("Enter hashed message to sign: ");
const privateKey = prompt("Enter private key: ");
signMessage(hashedMessage, privateKey);

async function signMessage(hashedMessage, privateKey) {
  const signedMessage = await secp.sign(hashedMessage, privateKey);
  console.log("Signature: " + toHex(signedMessage) + "\n");
}
