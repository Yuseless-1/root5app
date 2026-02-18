
import React from 'react';
import { DevUpdate } from '../types';

const UPDATES: DevUpdate[] = [
  {
    id: '1',
    title: 'Mainnet Alpha Launch v0.9',
    content: 'We are thrilled to announce that Root5 DAO has officially deployed its core liquidity modules to Ethereum Mainnet. This release includes the basic vault architecture and the governance contract suite.',
    date: 'March 15, 2024',
    tag: 'Core'
  },
  {
    id: '2',
    title: 'New Analytics Dashboard',
    content: 'The governance frontend now features a full real-time analytics suite, tracking TVL, asset distribution, and historical voting turnout.',
    date: 'March 12, 2024',
    tag: 'UI'
  },
  {
    id: '3',
    title: 'Security Audit by OpenZeppelin',
    content: 'Our smart contracts have completed their first round of security audits. All high-priority findings have been addressed in the latest commit.',
    date: 'March 05, 2024',
    tag: 'Security'
  },
  {
    id: '4',
    title: 'Cross-chain Bridge Prototype',
    content: 'Internal testing has begun for our LayerZero-based asset bridge, allowing the DAO treasury to deploy capital on Arbitrum and Optimism.',
    date: 'February 28, 2024',
    tag: 'Infrastructure'
  }
];

const Updates: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">Development <span className="text-[var(--color-primary-purple)]">Updates</span></h1>
        <p className="text-[var(--color-text-white-60)] text-lg max-w-2xl mx-auto leading-relaxed">
          Stay up to date with the latest technical milestones and ecosystem growth within the Root5 DAO.
        </p>
      </header>

      <div className="relative border-l border-[var(--color-border-light)] ml-4 md:ml-8 pl-8 md:pl-12 space-y-16">
        {UPDATES.map((update) => (
          <div key={update.id} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-[var(--color-background)] border-4 border-[var(--color-primary-purple)]/30 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-[var(--color-primary-purple)]"></div>
            </div>

            <div className="glass p-8 rounded-3xl border border-[var(--color-border-medium)] hover:border-[var(--color-primary-purple)]/30 transition-all hover:translate-y-[-4px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  update.tag === 'Core' ? 'bg-[var(--color-primary-purple)]/20 text-[var(--color-primary-purple)]' :
                  update.tag === 'UI' ? 'bg-[var(--color-secondary-blue)]/20 text-[var(--color-secondary-blue)]' :
                  update.tag === 'Security' ? 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]' :
                  'bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)]'
                }`}>
                  {update.tag}
                </span>
                <span className="text-[var(--color-text-white-30)] text-xs font-mono">{update.date}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{update.title}</h3>
              <p className="text-[var(--color-text-white-60)] leading-relaxed text-lg">
                {update.content}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <button className="text-sm font-bold text-[var(--color-primary-purple)] hover:text-[var(--color-primary-purple-dark)] flex items-center gap-1 group">
                  Read full devlog 
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-12 rounded-[40px] text-center space-y-6 border border-[var(--color-border-medium)]">
        <h2 className="text-3xl font-bold">Never miss an update.</h2>
        <p className="text-[var(--color-text-white-40)] max-w-sm mx-auto">Subscribe to our newsletter to receive weekly governance digests and technical summaries.</p>
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="vitalik@ethereum.org" 
            className="flex-1 bg-[var(--color-border-light)] border border-[var(--color-border-medium)] rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--color-primary-purple)] transition-colors"
          />
          <button className="bg-[var(--color-text-white-full)] text-[var(--color-background)] font-bold px-8 py-4 rounded-2xl hover:bg-[var(--color-text-white-80)] transition-all active:scale-95">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Updates;
