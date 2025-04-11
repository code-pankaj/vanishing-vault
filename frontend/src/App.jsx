import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import DownloadPage from "./pages/DownloadPage";
import Sidebar from "./components/Sidebar";
import WalletConnect from "./components/WalletConnect";
import "./App.css";

function App() {
  const [walletAddr, setWalletAddr] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("wallet");
    if (stored) setWalletAddr(stored);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="app-main">
          {!walletAddr ? (
            <div className="wallet-section">
              <WalletConnect onConnect={(addr) => setWalletAddr(addr)} />
            </div>
          ) : (
            <>
              <div className="wallet-top">
                <span className="wallet-address">{walletAddr}</span>
                <button onClick={() => {
                  localStorage.removeItem("wallet");
                  setWalletAddr(null);
                }} className="disconnect-btn">Disconnect</button>
              </div>
              <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/download" element={<DownloadPage />} />
              </Routes>
            </>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
