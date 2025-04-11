import { useEffect, useState } from "react";
import "./walletConnect.css";

function WalletConnect({ onConnect }) {
    const connectWallet = async () => {
      if (!window.arweaveWallet) {
        alert("Please install ArConnect extension.");
        return;
      }
  
      try {
        await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
        const addr = await window.arweaveWallet.getActiveAddress();
        localStorage.setItem("wallet", addr);
        onConnect(addr); // Notify parent
      } catch (err) {
        console.error("Wallet connect error:", err);
      }
    };
  
    return (
      <button onClick={connectWallet} className="connect-btn">
        Connect Arweave Wallet
      </button>
    );
  }
  
  export default WalletConnect;

