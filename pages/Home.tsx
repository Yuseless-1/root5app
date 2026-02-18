
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const stats = [
    { label: 'Total Value Locked', value: '$42.8M', change: '+12%' },
    { label: 'Active Proposals', value: '14', change: '' },
    { label: 'Total Voters', value: '3,842', change: '+124' },
    { label: 'Treasury Assets', value: '24', change: '' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Shape the future of <span className="gradient-text">Root5 Ecosystem.</span>
        </h1>
        <p className="text-[var(--color-text-white-60)] text-lg leading-relaxed mb-8">
          The governance hub where community members propose, vote, and manage the decentralized treasury. Root5 is building the next generation of modular liquidity infrastructure.
        </p>
        <div className="flex gap-4">
          <Link to="/proposals" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-purple-600/20">
            View Proposals
          </Link>
          <Link to="/updates" className="border border-[var(--color-border-light)] hover:bg-[var(--color-border-light)] px-6 py-3 rounded-xl font-bold transition-all">
            Dev Updates
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-[var(--color-border-medium)]">
            <p className="text-[var(--color-text-white-40)] text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold font-mono">{stat.value}</p>
              {stat.change && (
                <span className="text-green-400 text-xs font-bold">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Proposals</h2>
            <Link to="/proposals" className="text-[var(--color-primary-purple)] text-sm hover:underline">View All</Link>
          </div>
          {[1, 2, 3].map((id) => (
            <div key={id} className="glass group hover:border-[var(--color-primary-purple)]/50 p-6 rounded-2xl border border-[var(--color-border-medium)] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">Active</span>
                <span className="text-[var(--color-text-white-30)] text-xs font-mono">End in 2d 14h</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-primary-purple)] transition-colors">
                R5P-{id}: Implementation of dynamic liquidity rebalancing modules
              </h3>
              <p className="text-[var(--color-text-white-60)] text-sm line-clamp-2">
                This proposal aims to introduce automated rebalancing strategies for the core Root5 pools to maximize capital efficiency during high volatility periods.
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Treasury Distribution</h2>
          <div className="glass p-6 rounded-2xl border border-[var(--color-border-medium)]">
            <div className="aspect-square relative flex items-center justify-center">
              {/* Simple Mock Pie Chart Illustration */}
              <div className="w-full h-full rounded-full border-[16px] border-[var(--color-primary-purple)]/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono">$42.8M</p>
                  <p className="text-xs text-[var(--color-text-white-40)]">Total Value</p>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary-purple)]"></div>
                  <span>ETH</span>
                </div>
                <span className="font-mono text-[var(--color-text-white-60)]">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-secondary-blue)]"></div>
                  <span>USDC</span>
                </div>
                <span className="font-mono text-[var(--color-text-white-60)]">30%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)]"></div>
                  <span>R5T</span>
                </div>
                <span className="font-mono text-[var(--color-text-white-60)]">25%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
