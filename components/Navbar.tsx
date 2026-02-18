
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
  signLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ wallet, connectWallet, disconnectWallet, signLogin }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Proposals', path: '/proposals' },
    { name: 'Treasury', path: '/treasury' },
    { name: 'Updates', path: '/updates' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[var(--color-border-light)] px-4 py-3 md:px-8">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-primary-purple)] to-[var(--color-secondary-blue)] flex items-center justify-center font-bold text-lg">
            R5
          </div>
          <span className="hidden md:block font-bold text-xl tracking-tight">ROOT5 <span className="text-[var(--color-primary-purple)]">DAO</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[var(--color-primary-purple)] ${
                isActive(link.path) ? 'text-[var(--color-primary-purple)]' : 'text-[var(--color-text-white-60)]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!wallet.isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 text-[var(--color-text-white-full)] px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] text-[var(--color-text-white-40)] font-mono uppercase tracking-widest">
                  {wallet.isSigned ? 'Authenticated' : 'Connected'}
                </span>
                <span className="text-xs font-mono text-[var(--color-primary-purple)]">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={wallet.isSigned ? disconnectWallet : signLogin}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                  wallet.isSigned 
                  ? 'border border-[var(--color-border-light)] hover:bg-[var(--color-border-light)] text-[var(--color-text-white-80)]' 
                  : 'bg-blue-600 hover:bg-blue-700 text-[var(--color-text-white-full)]'
                }`}
              >
                {wallet.isSigned ? 'Log Out' : 'Sign Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
