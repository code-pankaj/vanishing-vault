import { useState } from 'react'
import WalletConnect from './components/WalletConnect'
import UploadForm from './components/UploadForm'

function App() {
  const [walletAddr, setWalletAddr] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Vanishing Vault 🔐</h1>
      <WalletConnect onWalletConnect={setWalletAddr} />
      {walletAddr && <UploadForm walletAddr={walletAddr} />}
    </div>
  )
}

export default App
