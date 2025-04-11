import { useEffect, useState } from "react";

function WalletConnect() {
  const [walletAddr, setWalletAddr] = useState(null);

  // Check if already connected
  useEffect(() => {
    const stored = localStorage.getItem("wallet");
    if (stored) setWalletAddr(stored);
  }, []);

  const connectWallet = async () => {
    if (!window.arweaveWallet) {
      alert("Please install ArConnect extension.");
      return;
    }

    try {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
      const addr = await window.arweaveWallet.getActiveAddress();
      setWalletAddr(addr);
      localStorage.setItem("wallet", addr);
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  const disconnect = () => {
    localStorage.removeItem("wallet");
    setWalletAddr(null);
  };

  return (
    <div>
      {walletAddr ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 truncate max-w-[150px]">{walletAddr}</span>
          <button onClick={disconnect} className="text-xs text-red-500 hover:underline">
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default WalletConnect;
