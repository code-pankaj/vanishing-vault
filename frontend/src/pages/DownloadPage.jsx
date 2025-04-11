import { useState } from "react";

function DownloadPage() {
  const [txId, setTxId] = useState("");
  const [status, setStatus] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);

  const handleDownload = async () => {
    setStatus("⏳ Fetching data...");
    setDownloadLink(null);

    try {
      // Fetch encrypted file
      const fileRes = await fetch(`https://arweave.net/${txId}`);
      if (!fileRes.ok) throw new Error("Failed to fetch file");
      const fileBuffer = await fileRes.arrayBuffer();

      // Fetch encryption key
      const keyRes = await fetch(`http://localhost:5000/key/${txId}`);
      const keyJson = await keyRes.json();

      if (!keyRes.ok || !keyJson.key) {
        setStatus("❌ Key unavailable or expired.");
        return;
      }

      const keyBase64 = keyJson.key;
      const keyBytes = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

      const iv = new Uint8Array(fileBuffer.slice(0, 12)); // First 12 bytes: IV
      const encryptedContent = fileBuffer.slice(12); // Rest: actual content

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Download & Decrypt</h2>

      <input
        type="text"
        placeholder="Enter Transaction ID"
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Fetch & Decrypt
      </button>

      {status && <p className="text-sm text-gray-700">{status}</p>}

      {downloadLink && (
        <a
          href={downloadLink}
          download={`vault-${Date.now()}`}
          className="text-blue-600 hover:underline block mt-2"
        >
          ⬇️ Click here to download
        </a>
      )}
    </div>
  );
}

export default DownloadPage;
