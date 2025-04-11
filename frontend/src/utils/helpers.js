export function formatBytes(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  }
  
  export async function getArPrice(bytes) {
    try {
      const res = await fetch(`https://arweave.net/price/${bytes}`);
      const winston = await res.text();
      return parseFloat(winston) / 1e12; // Winston to AR
    } catch (e) {
      return 0;
    }
  }
  