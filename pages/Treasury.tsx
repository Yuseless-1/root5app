
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTreasury } from '../useTreasury'; // Import the new hook
import { TreasuryAsset } from '../types'; // Also import TreasuryAsset for the fallback mock data

// Fallback Mock data for when live fetching completely fails
const MOCK_SOLANA_TREASURY_DATA: TreasuryAsset[] = [
  { symbol: 'SOL', name: 'Solana', balance: 1200, valueUsd: 180000, color: 'var(--color-primary-purple)' },
  { symbol: 'USDC', name: 'USD Coin', balance: 5000000, valueUsd: 5000000, color: 'var(--color-secondary-blue)' },
  { symbol: 'JUP', name: 'Jupiter', balance: 1500000, valueUsd: 1800000, color: 'var(--color-accent-orange)' },
  { symbol: 'PYTH', name: 'Pyth Network', balance: 3000000, valueUsd: 1200000, color: 'var(--color-accent-light-purple)' },
  { symbol: 'BONK', name: 'Bonk', balance: 50000000000, valueUsd: 1000000, color: 'var(--color-accent-yellow-orange)' },
];

const MOCK_HISTORY_DATA = [
  { date: 'Jan', value: 32000000 },
  { date: 'Feb', value: 35000000 },
  { date: 'Mar', value: 34500000 },
  { date: 'Apr', value: 38000000 },
  { date: 'May', value: 41000000 },
  { date: 'Jun', value: 42800000 },
];


const Treasury: React.FC = () => {
  const { treasuryAssets, totalValue, history, loading, error, refetch } = useTreasury();

  // Determine which data to use: live or fallback mock
  const displayAssets = error && !treasuryAssets.length ? MOCK_SOLANA_TREASURY_DATA : treasuryAssets;
  const displayTotalValue = error && !treasuryAssets.length ? MOCK_SOLANA_TREASURY_DATA.reduce((sum, asset) => sum + asset.valueUsd, 0) : totalValue;
  const displayHistory = error && !history.length ? MOCK_HISTORY_DATA : history;


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-[var(--color-primary-purple)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-[var(--color-text-white-60)]">Loading treasury data from Squads...</p>
        <p className="text-sm text-[var(--color-text-white-40)] mt-2">This may take a few moments as we fetch live on-chain data and prices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-4xl font-bold mb-2">Protocol Treasury</h1>
        <p className="text-[var(--color-text-white-60)] text-lg font-mono">
          Total Balance: ${displayTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </header>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl flex items-center justify-between text-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.554 2.603-1.554 3.368 0l1.523 3.102A3 3 0 0016 9.381V18a2 2 0 01-2 2H6a2 2 0 01-2-2V9.381a3 3 0 00-1.071-2.18zM12 9a1 1 0 10-2 0v5a1 1 0 102 0V9z" clipRule="evenodd" /></svg>
            <span>Live data unavailable — showing cached or mock data. {error}</span>
          </div>
          <button onClick={refetch} className="font-semibold underline hover:text-[var(--color-text-white-full)]">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-[var(--color-border-medium)]">
          <h2 className="text-xl font-bold mb-6">Balance History</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayHistory}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-white-40)', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-white-40)', fontSize: 12 }}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid var(--color-border-medium)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--color-primary-purple)' }}
                  formatter={(val: number) => [`$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-primary-purple)" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-[var(--color-border-medium)] flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-6 w-full text-left">Allocation</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayAssets}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="valueUsd"
                >
                  {displayAssets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111', border: '1px solid var(--color-border-medium)', borderRadius: '12px' }}
                   formatter={(val: number, name: string, props) => ([`$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, props.payload.name])}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full mt-4 space-y-3">
             {displayAssets.map(asset => (
               <div key={asset.symbol} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }}></div>
                   <span className="font-bold">{asset.symbol}</span>
                 </div>
                 <span className="text-[var(--color-text-white-40)] font-mono">${(asset.valueUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl border border-[var(--color-border-medium)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[rgba(255,255,255,0.02)]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-white-40)]">Asset</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-white-40)]">Balance</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-white-40)]">Value (USD)</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-white-40)]">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {displayAssets.map((asset) => (
              <tr key={asset.symbol} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${asset.color}20`, color: asset.color }}>
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold">{asset.name}</div>
                      <div className="text-[10px] text-[var(--color-text-white-30)] font-mono">{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-mono text-sm">
                  {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </td>
                <td className="px-6 py-5 font-mono text-sm">
                  ${asset.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-primary-purple)]" style={{ width: `${(asset.valueUsd / displayTotalValue) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-[var(--color-text-white-40)]">
                      {((asset.valueUsd / displayTotalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Treasury;