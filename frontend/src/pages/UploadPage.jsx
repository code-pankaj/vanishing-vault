import { useState } from "react";
import { encryptFile } from "../utils/crypto";
import { formatBytes, getArPrice } from "../utils/helpers";
import "./uploadPage.css";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const arPrice = await getArPrice(selected.size);
      setPrice(arPrice.toFixed(6));
    }
  };

  const handleUpload = async () => {
    if (!file || !expiry) {
      alert("Please select file and expiry");
      return;
    }

    const { encryptedFile, key } = await encryptFile(file);
    const formData = new FormData();
    formData.append("file", encryptedFile, `enc-${Date.now()}-${file.name}`);

    try {
      const uploadRes = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const uploadJson = await uploadRes.json();
      const tx_id = uploadJson.tx_id || uploadJson.supabase_url;

      const keyRes = await fetch("http://localhost:5000/key/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_id,
          enc_key: key,
          expiry: new Date(expiry).toISOString(),
        }),
      });

      if (keyRes.ok) {
        setStatus("✅ File uploaded and key stored successfully.");
      } else {
        setStatus("⚠️ File uploaded but key storage failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload File to Vanishing Vault</h2>

      <input type="file" onChange={handleFileChange} className="upload-input-file" />
      {file && (
        <div className="upload-meta">
          Size: {formatBytes(file.size)} • Estimated Cost: <b>{price} AR</b>
        </div>
      )}

      <label className="upload-label">
        Expiry Time:
        <input
          type="datetime-local"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="upload-input-datetime"
        />
      </label>

      <button onClick={handleUpload} className="upload-btn">
        Upload & Encrypt
      </button>

      {status && <p className="upload-status">{status}</p>}
    </div>
  );
}

export default UploadPage;
