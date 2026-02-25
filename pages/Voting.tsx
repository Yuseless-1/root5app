
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WalletState, Proposal, ProposalStatus } from '../types';

interface VotingProps {
  wallet: WalletState;
  signLogin: () => void;
}

const Voting: React.FC<VotingProps> = ({ wallet, signLogin }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVote, setSelectedVote] = useState<'FOR' | 'AGAINST' | 'ABSTAIN' | null>(null);
  const [isCasting, setIsCasting] = useState(false);

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
    votesAbstain: 5000,
    createdAt: '2024-03-10',
    expiresAt: '2024-03-24'
  };

  if (!wallet.isSigned) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          Voting requires a valid Web3 signature to verify your governance power.
        </p>
        <button
          onClick={signLogin}
          className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-500/30"
        >
          Sign to Access Voting
        </button>
      </div>
    );
  }

  const handleVote = async () => {
    if (!selectedVote) return;
    setIsCasting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsCasting(false);
    alert(`Successfully voted ${selectedVote} for ${proposal.id}`);
    navigate('/proposals'); // Navigate back to proposals after voting
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="lg:col-span-2 space-y-8">
        <button 
          onClick={() => navigate('/proposals')}
          className="text-white/40 hover:text-green-400 flex items-center gap-2 text-sm font-bold transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Proposals
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-lg border border-green-500/20">{proposal.id}</span>
            <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-green-500/20">Active Voting</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">{proposal.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/30 font-mono">
            <span>By: <span className="text-white/80">{proposal.proposer}</span></span>
            <span>Created: <span className="text-white/80">{proposal.createdAt}</span></span>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] border border-white/5">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            Executive Summary
          </h2>
          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed text-lg whitespace-pre-wrap font-medium">
            {proposal.description}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass p-8 rounded-[40px] border border-white/5 sticky top-24">
          <h3 className="text-xl font-bold mb-8">Cast Your Vote</h3>
          
          <div className="space-y-4 mb-10">
            <button
              onClick={() => setSelectedVote('FOR')}
              className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group ${
                selectedVote === 'FOR' 
                ? 'bg-green-500/10 border-green-500 text-green-400 ring-2 ring-green-500/10' 
                : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              <span className="font-bold text-lg">Vote FOR</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedVote === 'FOR' ? 'bg-green-500 border-green-500' : 'border-white/10'}`}>
                {selectedVote === 'FOR' && <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
            </button>
            
            <button
              onClick={() => setSelectedVote('AGAINST')}
              className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group ${
                selectedVote === 'AGAINST' 
                ? 'bg-red-500/10 border-red-500 text-red-400 ring-2 ring-red-500/10' 
                : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              <span className="font-bold text-lg">Vote AGAINST</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedVote === 'AGAINST' ? 'bg-red-500 border-red-500' : 'border-white/10'}`}>
                {selectedVote === 'AGAINST' && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
            </button>

            <button
              onClick={() => setSelectedVote('ABSTAIN')}
              className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group ${
                selectedVote === 'ABSTAIN' 
                ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 ring-2 ring-yellow-500/10' 
                : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              <span className="font-bold text-lg">Vote ABSTAIN</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedVote === 'ABSTAIN' ? 'bg-yellow-500 border-yellow-500' : 'border-white/10'}`}>
                {selectedVote === 'ABSTAIN' && <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
            </button>
          </div>

          <button
            disabled={!selectedVote || isCasting}
            onClick={handleVote}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              !selectedVote || isCasting
              ? 'bg-white/5 text-white/10 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-black shadow-xl shadow-green-500/20 active:scale-95'
            }`}
          >
            {isCasting ? (
              <>
                <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                Casting Vote...
              </>
            ) : 'Cast Governance Power'}
          </button>

          <div className="mt-12 pt-8 border-t border-white/5">
            <h4 className="text-[10px] font-bold mb-6 uppercase tracking-[0.2em] text-white/30">Live Results</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-green-400 uppercase">For</span>
                  <span className="text-white/80">{proposal.votesFor.toLocaleString()} R5T</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain)) * 100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-red-400 uppercase">Against</span>
                  <span className="text-white/80">{proposal.votesAgainst.toLocaleString()} R5T</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain)) * 100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-yellow-400 uppercase">Abstain</span>
                  <span className="text-white/80">{proposal.votesAbstain.toLocaleString()} R5T</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(252,211,77,0.4)]" style={{ width: `${(proposal.votesAbstain / (proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain)) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <p className="mt-10 text-[10px] text-white/20 leading-relaxed font-medium uppercase tracking-widest text-center">
              Quorum: 1M R5T Required • Status: REACHED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;