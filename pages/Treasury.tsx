
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TreasuryAsset } from '../types';

const ASSETS: TreasuryAsset[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 14200, valueUsd: 18460000, color: '#059669' },
  { symbol: 'USDC', name: 'USD Coin', balance: 12500000, valueUsd: 12500000, color: '#06b6d4' },
  { symbol: 'R5T', name: 'Root5 Token', balance: 45000000, valueUsd: 9000000, color: '#4ade80' },
  { symbol: 'wBTC', name: 'Wrapped Bitcoin', balance: 84, valueUsd: 2840000, color: '#f59e0b' },
];

const HISTORY_DATA = [
  { date: 'Jan', value: 32000000 },
  { date: 'Feb', value: 35000000 },
  { date: 'Mar', value: 34500000 },
  { date: 'Apr', value: 38000000 },
  { date: 'May', value: 41000000 },
  { date: 'Jun', value: 42800000 },
];

const Treasury: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold mb-3 tracking-tight">Treasury</h1>
          <p className="text-green-400 text-lg font-mono font-bold tracking-tighter">Total Assets Under Management: $42,800,000.00</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="text-white/30 mr-2">BLOCK:</span>
            <span>19,482,021</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[40px] border border-white/5">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
             NAV History (USD)
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `$${val / 1000000}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'NAV']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4ade80" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] border border-white/5 flex flex-col">
          <h2 className="text-2xl font-bold mb-8">Allocation</h2>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ASSETS}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="valueUsd"
                >
                  {ASSETS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Liquid</p>
                <p className="text-2xl font-bold font-mono">100%</p>
              </div>
            </div>
          </div>
          <div className="w-full mt-8 space-y-4">
             {ASSETS.map(asset => (
               <div key={asset.symbol} className="flex items-center justify-between text-sm group">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: asset.color, color: asset.color }}></div>
                   <span className="font-bold text-white/70 group-hover:text-white transition-colors">{asset.symbol}</span>
                 </div>
                 <span className="text-white/40 font-mono font-bold">${(asset.valueUsd / 1000000).toFixed(1)}M</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-[32px] border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Asset</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Balance</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Value (USD)</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Distribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ASSETS.map((asset) => (
              <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border border-white/5 bg-white/[0.02]" style={{ color: asset.color }}>
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white/90 group-hover:text-white">{asset.name}</div>
                      <div className="text-[10px] text-white/30 font-mono tracking-widest">{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-mono text-sm font-bold text-white/70">
                  {asset.balance.toLocaleString()}
                </td>
                <td className="px-8 py-6 font-mono text-sm font-bold text-white/70">
                  ${asset.valueUsd.toLocaleString()}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-1000" style={{ backgroundColor: asset.color, width: `${(asset.valueUsd / 42800000) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white/30">
                      {((asset.valueUsd / 42800000) * 100).toFixed(1)}%
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