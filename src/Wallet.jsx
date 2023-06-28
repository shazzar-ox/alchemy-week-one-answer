import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = toHex(secp256k1.getPublicKey(privateKey));
    setAddress(publicKey);

    if (privateKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${privateKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type a Private Key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>{address.slice(1, 10)}....</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
