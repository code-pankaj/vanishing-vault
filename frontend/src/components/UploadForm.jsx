import { useState, useEffect } from "react";
import axios from "axios";

const UploadForm = ({ walletAddr }) => {
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [priceAR, setPriceAR] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await fetchPrice(selectedFile.size);
    }
  };

  const fetchPrice = async (size) => {
    try {
      const res = await axios.get(`https://arweave.net/price/${size}`);
      const winston = res.data;
      const ar = parseFloat(winston) / 1e12;
      setPriceAR(ar.toFixed(6));
    } catch (err) {
      console.error("Failed to fetch AR price", err);
      setPriceAR(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !expiry || !walletAddr) {
      alert("Please fill all fields and connect your wallet.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("wallet", walletAddr);
    formData.append("expiry", expiry);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setMessage("✅ File uploaded & encrypted successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Check console for error.");
    } finally {
      setUploading(false);
    }
  };

  const readableFileSize = file ? `${(file.size / 1024).toFixed(2)} KB` : "-";

  return (
    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl mt-6 text-white shadow-lg space-y-4">
      <h2 className="text-xl font-semibold">📤 Upload to Vanishing Vault</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
      />

      {file && (
        <div className="text-sm">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Size:</strong> {readableFileSize}</p>
          <p><strong>Estimated Price:</strong> {priceAR ? `${priceAR} AR` : "Loading..."}</p>
        </div>
      )}

      <label className="block mt-4 text-sm font-medium">
        ⏳ Set Expiry Date & Time:
      </label>
      <input
        type="datetime-local"
        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
        onChange={(e) => setExpiry(new Date(e.target.value).toISOString())}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold mt-4 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload & Lock 🔐"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
};

export default UploadForm;
