
import React, { useState } from 'react';
import { WalletState, ProposalStatus, Proposal } from '../types';
import { Link } from 'react-router-dom';

interface ProposalsProps {
  wallet: WalletState;
  signLogin: () => void;
  connectWallet: () => void;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'R5P-014',
    title: 'Migrate Treasury management to Gnosis Safe v1.3',
    description: 'Upgrading our core treasury multisig to use the latest secure standards.',
    proposer: '0x1234...5678',
    status: ProposalStatus.ACTIVE,
    votesFor: 1250000,
    votesAgainst: 12000,
    createdAt: '2024-03-10',
    expiresAt: '2024-03-24'
  },
  {
    id: 'R5P-013',
    title: 'Expand liquidity mining rewards for R5/WETH pair',
    description: 'Incentivizing deeper liquidity for our native token to reduce slippage.',
    proposer: '0x9876...4321',
    status: ProposalStatus.PASSED,
    votesFor: 4800000,
    votesAgainst: 240000,
    createdAt: '2024-03-01',
    expiresAt: '2024-03-08'
  },
  {
    id: 'R5P-012',
    title: 'Integrate Chainlink CCIP for cross-chain governance',
    description: 'Enabling voting and proposal execution across multiple L2 networks.',
    proposer: '0xbeef...dead',
    status: ProposalStatus.REJECTED,
    votesFor: 500000,
    votesAgainst: 850000,
    createdAt: '2024-02-20',
    expiresAt: '2024-02-27'
  }
];

const Proposals: React.FC<ProposalsProps> = ({ wallet, signLogin, connectWallet }) => {
  const [filter, setFilter] = useState<string>('All');

  const handleCreateProposalClick = () => {
    if (!wallet.isConnected) {
      connectWallet();
    } else if (!wallet.isSigned) {
      signLogin();
    } else {
      // Logic to create proposal (e.g., open a modal, navigate to a form)
      alert('Initiating new proposal creation!');
    }
  };

  const createButtonText = !wallet.isConnected
    ? 'Connect to Create'
    : !wallet.isSigned
      ? 'Sign in to Create'
      : '+ Create Proposal';

  const createButtonClass = !wallet.isSigned
    ? 'bg-purple-600 hover:bg-purple-700 text-[var(--color-text-white-full)]'
    : 'bg-[var(--color-text-white-full)] text-[var(--color-background)] hover:bg-[var(--color-text-white-80)]';

  const filteredProposals = filter === 'All' 
    ? MOCK_PROPOSALS 
    : MOCK_PROPOSALS.filter(p => p.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Governance Proposals</h1>
          <p className="text-[var(--color-text-white-60)]">Manage the lifecycle of the DAO through community-led proposals.</p>
        </div>
        <button 
          onClick={handleCreateProposalClick}
          className={`${createButtonClass} px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-purple-600/20 active:scale-95`}
        >
          {createButtonText}
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Active', 'Passed', 'Rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f 
              ? 'bg-purple-600 text-[var(--color-text-white-full)]' 
              : 'bg-[var(--color-border-light)] text-[var(--color-text-white-40)] hover:bg-[var(--color-border-medium)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProposals.map((proposal) => (
          <Link
            to={`/voting/${proposal.id}`}
            key={proposal.id}
            className="glass block group p-6 rounded-2xl border border-[var(--color-border-medium)] hover:border-[var(--color-primary-purple)]/50 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[var(--color-primary-purple)] font-bold">{proposal.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  proposal.status === ProposalStatus.ACTIVE ? 'bg-green-500/20 text-green-400' :
                  proposal.status === ProposalStatus.PASSED ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {proposal.status}
                </span>
              </div>
              <div className="text-[var(--color-text-white-30)] text-xs font-mono">
                Proposed by: <span className="text-[var(--color-text-white-60)]">{proposal.proposer}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4 group-hover:text-[var(--color-primary-purple)] transition-colors">
              {proposal.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-green-400">FOR: {proposal.votesFor.toLocaleString()} R5T</span>
                  <span className="text-[var(--color-text-white-40)]">{((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--color-border-light)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs font-mono mt-4 mb-1">
                  <span className="text-red-400">AGAINST: {proposal.votesAgainst.toLocaleString()} R5T</span>
                  <span className="text-[var(--color-text-white-40)]">{((proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--color-border-light)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-[var(--color-text-white-30)] uppercase tracking-widest mb-1">Voting Ends</p>
                  <p className="font-mono text-sm">{proposal.expiresAt}</p>
                </div>
                <div className="text-[var(--color-primary-purple)] group-hover:translate-x-1 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Proposals;
