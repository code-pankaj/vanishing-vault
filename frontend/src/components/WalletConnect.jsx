// src/components/WalletConnect.jsx
import { useState, useEffect } from 'react';

const WalletConnect = ({ onWalletConnect }) => {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.arweaveWallet) {
        alert('ArConnect is not installed. Please install it to continue.');
        return;
      }

      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
      const addr = await window.arweaveWallet.getActiveAddress();
      setAddress(addr);
      onWalletConnect(addr);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    onWalletConnect('');
  };

  useEffect(() => {
    if (window.arweaveWallet) {
      window.arweaveWallet.getActiveAddress().then(addr => {
        if (addr) {
          setAddress(addr);
          onWalletConnect(addr);
        }
      });
    }
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg text-white">
      {address ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Connected: <span className="font-mono">{address.slice(0, 5)}...{address.slice(-4)}</span>
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-semibold"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl font-semibold"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
