
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Proposals from './pages/Proposals';
import Voting from './pages/Voting';
import Treasury from './pages/Treasury';
import Updates from './pages/Updates';
import Navbar from './components/Navbar';
import { WalletState } from './types';

const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isSigned: false,
  });

  const connectWallet = async () => {
    // Simulate wallet connection logic
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    setWallet({
      address: mockAddress,
      isConnected: true,
      isSigned: false,
    });
  };

  const signLogin = async () => {
    if (!wallet.address) return;
    setWallet(prev => ({ ...prev, isSigned: true }));
    alert('Logged in successfully via Web3 Signature');
  };

  const disconnectWallet = () => {
    setWallet({ address: null, isConnected: false, isSigned: false });
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#030303] text-white selection:bg-green-500/30">
        <Navbar 
          wallet={wallet} 
          connectWallet={connectWallet} 
          disconnectWallet={disconnectWallet}
          signLogin={signLogin}
        />
        
        <main className="flex-1 container mx-auto px-4 py-8 md:px-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/proposals" 
              element={<Proposals wallet={wallet} signLogin={signLogin} />} 
            />
            <Route 
              path="/voting/:id" 
              element={<Voting wallet={wallet} signLogin={signLogin} />} 
            />
            <Route path="/treasury" element={<Treasury />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </main>

        <footer className="border-t border-white/5 py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-white/40 text-sm">
            &copy; 2024 Root5 DAO Governance Ecosystem. Powered by Modular Liquidity.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;