import { useState } from "react";
import "./downloadPage.css";

function DownloadPage() {
  const [txId, setTxId] = useState("");
  const [status, setStatus] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);

  const handleDownload = async () => {
    setStatus("⏳ Fetching data...");
    setDownloadLink(null);

    try {
      const fileRes = await fetch(`https://arweave.net/${txId}`);
      if (!fileRes.ok) throw new Error("Failed to fetch file");
      const fileBuffer = await fileRes.arrayBuffer();

      const keyRes = await fetch(`http://localhost:5000/key/${txId}`);
      const keyJson = await keyRes.json();

      if (!keyRes.ok || !keyJson.key) {
        setStatus("❌ Key unavailable or expired.");
        return;
      }

      const keyBase64 = keyJson.key;
      const keyBytes = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

      const iv = new Uint8Array(fileBuffer.slice(0, 12));
      const encryptedContent = fileBuffer.slice(12);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM", iv },
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encryptedContent
      );

      const blob = new Blob([decrypted]);
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
      setStatus("✅ File decrypted. Ready to download.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Decryption failed. Possibly expired or invalid data.");
    }
  };

  return (
    <div className="download-container">
      <h2 className="download-title">Download & Decrypt</h2>

      <input
        type="text"
        placeholder="Enter Transaction ID"
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
        className="download-input"
      />

      <button onClick={handleDownload} className="download-btn">
        Fetch & Decrypt
      </button>

      {status && <p className="download-status">{status}</p>}

      {downloadLink && (
        <a
          href={downloadLink}
          download={`vault-${Date.now()}`}
          className="download-link"
        >
          ⬇️ Click here to download
        </a>
      )}
    </div>
  );
}

export default DownloadPage;
