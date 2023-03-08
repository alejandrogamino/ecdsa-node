import server from "./server";

function Wallet({
  signature,
  setSignature,
  address,
  setAddress,
  balance,
  setBalance,
  recoveryBit,
  setRecoveryBit,
  nonce,
  setNonce,
}) {
  function onAddressChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    getBalance(address, signature, recoveryBit);
  }

  function validate(signature) {
    if (signature.match(/[a-zA-Z0-9]+/) && signature.length >= 128) {
      return true;
    }
    return false;
  }

  async function getBalance(address, signature, recoveryBit) {
    if (
      address.length !== 0 &&
      signature.length !== 0 &&
      recoveryBit.length !== 0 &&
      validate(signature)
    ) {
      let rcvBit = Number(recoveryBit) || 0;
      const {
        data: [balance, nonce],
      } = await server.get(`verify/${address}/${signature}/${rcvBit}`); ///verify/:address/:signature/:recoveryBit
      setBalance(balance);
      setNonce(nonce);
    } else {
    }
  }

  function onSignatureChange(evt) {
    const signature = evt.target.value;
    setSignature(signature);
    getBalance(address, signature, recoveryBit);
  }

  function onRecoveryBitChange(evt) {
    const recoveryBit = evt.target.value;
    setRecoveryBit(recoveryBit);
    getBalance(address, signature, recoveryBit);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Wallet Address
        <input
          placeholder="Your wallet address"
          value={address}
          onChange={onAddressChange}
        ></input>
      </label>
      <label>
        Signature of your Wallet Address
        <input
          placeholder="Type the signature of your wallet adress"
          value={signature}
          onChange={onSignatureChange}
        ></input>
      </label>
      <label>
        Recovery Bit
        <input
          placeholder="Recovery Bit"
          value={recoveryBit}
          onChange={onRecoveryBitChange}
        ></input>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
