
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WalletState, Proposal, ProposalStatus } from '../types';

interface VotingProps {
  wallet: WalletState;
  signLogin: () => void;
  connectWallet: () => void;
}

const Voting: React.FC<VotingProps> = ({ wallet, signLogin, connectWallet }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVote, setSelectedVote] = useState<'FOR' | 'AGAINST' | null>(null);
  const [isCasting, setIsCasting] = useState(false);

  // In a real app, fetch the specific proposal from Supabase by ID
  const proposal: Proposal = {
    id: id || 'R5P-014',
    title: 'Migrate Treasury management to Gnosis Safe v1.3',
    description: `This proposal advocates for migrating our current 3-of-5 multisig treasury wallet to Gnosis Safe v1.3. 
    
    The primary objectives are:
    1. Improved security through updated smart contracts.
    2. Support for EIP-1271 (smart contract signatures).
    3. Better gas efficiency for batch transactions.
    
    The migration process will involve a 48-hour timelock period followed by the transfer of all protocol-owned liquidity. We estimate the one-time gas cost to be approximately 1.5 ETH at current market prices.`,
    proposer: '0x1234...5678',
    status: ProposalStatus.ACTIVE,
    votesFor: 1250000,
    votesAgainst: 12000,
    createdAt: '2024-03-10',
    expiresAt: '2024-03-24'
  };

  const handleAuthClick = () => {
    if (!wallet.isConnected) {
      connectWallet();
    } else {
      signLogin();
    }
  }

  const handleVote = async () => {
    if (!selectedVote) return;
    setIsCasting(true);
    // Simulate smart contract interaction / database update
    await new Promise(r => setTimeout(r, 2000));
    setIsCasting(false);
    alert(`Successfully voted ${selectedVote} for ${proposal.id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <button 
          onClick={() => navigate('/proposals')}
          className="text-[var(--color-text-white-40)] hover:text-[var(--color-text-white-full)] flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Proposals
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[var(--color-primary-purple)] font-bold">{proposal.id}</span>
            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">Active</span>
          </div>
          <h1 className="text-4xl font-bold">{proposal.title}</h1>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-white-40)] font-mono">
            <span>By: <span className="text-[var(--color-text-white-80)]">{proposal.proposer}</span></span>
            <span>Created: <span className="text-[var(--color-text-white-80)]">{proposal.createdAt}</span></span>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-[var(--color-border-medium)]">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="prose prose-invert max-w-none text-[var(--color-text-white-60)] leading-relaxed whitespace-pre-wrap">
            {proposal.description}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {wallet.isSigned ? (
          <div className="glass p-6 rounded-3xl border border-[var(--color-border-medium)] sticky top-24">
            <h3 className="text-xl font-bold mb-6">Cast Your Vote</h3>
            
            <div className="space-y-3 mb-8">
              <button
                onClick={() => setSelectedVote('FOR')}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                  selectedVote === 'FOR' 
                  ? 'bg-green-500/20 border-green-500 text-green-400 ring-2 ring-green-400/20' 
                  : 'bg-[var(--color-border-light)] border-[var(--color-border-medium)] text-[var(--color-text-white-60)] hover:border-[var(--color-border-medium)]'
                }`}
              >
                <span className="font-bold">Vote FOR</span>
                {selectedVote === 'FOR' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              </button>
              
              <button
                onClick={() => setSelectedVote('AGAINST')}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                  selectedVote === 'AGAINST' 
                  ? 'bg-red-500/20 border-red-500 text-red-400 ring-2 ring-red-400/20' 
                  : 'bg-[var(--color-border-light)] border-[var(--color-border-medium)] text-[var(--color-text-white-60)] hover:border-[var(--color-border-medium)]'
                }`}
              >
                <span className="font-bold">Vote AGAINST</span>
                {/* Fix: Corrected typo 'AGAINst' to 'AGAINST' */}
                {selectedVote === 'AGAINST' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              </button>
            </div>

            <button
              disabled={!selectedVote || isCasting}
              onClick={handleVote}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                !selectedVote || isCasting
                ? 'bg-[var(--color-border-light)] text-[var(--color-text-white-30)] cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-[var(--color-text-white-full)] shadow-xl shadow-purple-600/20 active:scale-95'
              }`}
            >
              {isCasting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-text-white-30)] border-t-[var(--color-text-white-full)] rounded-full animate-spin"></div>
                  Casting Vote...
                </>
              ) : 'Submit Vote'}
            </button>

            <div className="mt-8 pt-6 border-t border-[var(--color-border-light)]">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-[var(--color-text-white-40)]">Current Results</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>FOR</span>
                    <span>1,250,000 R5T</span>
                  </div>
                  <div className="h-1 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[94%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>AGAINST</span>
                    <span>12,000 R5T</span>
                  </div>
                  <div className="h-1 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[6%]"></div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[10px] text-[var(--color-text-white-30)] leading-tight">
                Quorum reached (min 1M R5T). Vote will be finalized on {proposal.expiresAt}.
              </p>
            </div>
          </div>
        ) : (
          <div className="glass p-6 rounded-3xl border border-[var(--color-border-medium)] sticky top-24 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-purple)]/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--color-primary-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Authenticate to Vote</h3>
            <p className="text-[var(--color-text-white-60)] mb-8 leading-relaxed">
              Please sign in with your Web3 wallet to verify your governance power and cast your vote on this proposal.
            </p>
            <button
              onClick={handleAuthClick}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-purple-600/20 active:scale-95"
            >
              {!wallet.isConnected ? 'Connect & Sign to Vote' : 'Sign to Cast Vote'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;
