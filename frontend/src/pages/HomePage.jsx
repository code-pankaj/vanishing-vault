import { useState, useEffect } from "react";
import Arweave from "arweave";
import ArConnect from "arconnect";
import "./home.css";

function HomePage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [arweave, setArweave] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
      });
      setArweave(arweave);
    } catch (err) {
      console.error("Failed to initialize:", err);
      setError("Failed to initialize Arweave.");
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.arweaveWallet) {
        setError("ArConnect extension not found. Please install it first.");
        return;
      }

      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "DISPATCH"
      ]);
      
      const address = await window.arweaveWallet.getActiveAddress();
      setWalletAddress(address);
      setError("");
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet. Please make sure ArConnect extension is installed and try again.");
    }
  };

  const disconnectWallet = async () => {
    try {
      if (!window.arweaveWallet) return;
      
      await window.arweaveWallet.disconnect();
      setWalletAddress("");
      setError("");
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
      setError("Failed to disconnect wallet. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Vanishing Vault</h1>
      
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}
      
      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="connect-btn"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <span className="wallet-address">Connected: {walletAddress}</span>
          <button
            onClick={disconnectWallet}
            className="disconnect-btn"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
