import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, nonce, setNonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");

  function onAmountChange(evt) {
    const amount = evt.target.value;
    setSendAmount(amount);
    updateHashedValue();
  }

  function onRecipientChange(evt) {
    const recipient = evt.target.value;
    setRecipient(recipient);
    updateHashedValue();
  }

  function updateHashedValue() {
    const message =
      address.trim() +
      parseInt(sendAmount) +
      recipient.trim() +
      parseInt(nonce);
    const hashedMessage = toHex(keccak256(utf8ToBytes(message)));
    setHashedMessage(hashedMessage);
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  // TODO: usar el nonce aquí para evitar replay de transacciones
  async function transfer(evt) {
    evt.preventDefault();

    try {
      const result = await server.post(`send`, {
        sender: address.trim(),
        amount: parseInt(sendAmount),
        recipient: recipient.trim(),
        nonce: parseInt(nonce),
        signedMessage: signedMessage.trim(),
      });
      const {
        data: [balance, newNonce],
      } = result;
      setBalance(balance);
      setNonce(newNonce);
      updateHashedValue();
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={onAmountChange}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={onRecipientChange}
        ></input>
      </label>

      <label>
        Hashed Message
        <input readOnly={true} placeholder="" value={hashedMessage}></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Sign the hashed message above with your private key and paste the signature here"
          value={signedMessage}
          onChange={setValue(setSignedMessage)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
