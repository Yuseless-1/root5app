
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
    // In a real app: check if window.ethereum exists, request accounts, handle errors.
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Example Ethereum address
    // For a Solana DApp, you would use a Solana wallet adapter (e.g., @solana/wallet-adapter-react)
    // and fetch a Solana public key.
    console.log("Connecting wallet...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async
    setWallet({
      address: mockAddress, // This would be a Solana public key for a Solana DApp
      isConnected: true,
      isSigned: false,
    });
    console.log("Wallet connected:", mockAddress);
  };

  const signLogin = async () => {
    // Simulate signing a message for Supabase/Backend login
    if (!wallet.address) {
      alert("Please connect your wallet first.");
      return;
    }
    
    console.log("Requesting signature for login...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async signature
    
    setWallet(prev => ({ ...prev, isSigned: true }));
    alert('Logged in successfully via Web3 Signature');
    console.log("Wallet signed in.");
  };

  const disconnectWallet = () => {
    setWallet({ address: null, isConnected: false, isSigned: false });
    console.log("Wallet disconnected.");
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-white-full)] selection:bg-[var(--color-primary-purple)]/30">
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
              element={<Proposals wallet={wallet} signLogin={signLogin} connectWallet={connectWallet} />} 
            />
            <Route 
              path="/voting/:id" 
              element={<Voting wallet={wallet} signLogin={signLogin} connectWallet={connectWallet} />} 
            />
            <Route path="/treasury" element={<Treasury />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </main>

        <footer className="border-t border-[var(--color-border-light)] py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-[var(--color-text-white-40)] text-sm">
            &copy; 2024 Root5 DAO Governance Ecosystem. All rights reserved.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
