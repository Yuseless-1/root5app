import { useState, useEffect, useCallback } from 'react';
import { TreasuryAsset } from './types';

// Constants
const SQUADS_MULTISIG_VAULT_ADDRESS = '7qcxTk4kGdiGUxD7T59tQygJToe4rC4F7GyTTyYYyPMK';
// Updated to a CORS-friendly RPC endpoint
const SOLANA_RPC_URL = 'https://solana-mainnet.g.alchemy.com/v2/demo'; 
// Updated to Jupiter's price API for browser compatibility
const JUPITER_PRICE_API = 'https://price.jup.ag/v6/price?ids=SOL,USDC,JUP,PYTH,BONK';
const REFRESH_INTERVAL_MS = 60 * 1000; // 60 seconds
const HISTORY_LOCAL_STORAGE_KEY = 'root5_treasury_history';
const MAX_HISTORY_SNAPSHOTS = 30;
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'; // SPL Token Program ID

// Hardcoded map for well-known Solana token mints and their properties
// This is critical as the raw token account does not contain symbol/name/decimals
const TOKEN_MINT_MAP = new Map<string, { symbol: string; name: string; decimals: number; coingeckoId: string | null; color: string }>();
// Note: coingeckoId is not strictly needed with Jupiter price API but kept for consistency/future use if other tokens are added.
// Jupiter's API uses symbols directly, so mapping mint to symbol is key.
TOKEN_MINT_MAP.set('So11111111111111111111111111111111111111112', { symbol: 'SOL', name: 'Solana', decimals: 9, coingeckoId: 'solana', color: 'var(--color-primary-purple)' }); // Primary Purple
TOKEN_MINT_MAP.set('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', { symbol: 'USDC', name: 'USD Coin', decimals: 6, coingeckoId: 'usd-coin', color: 'var(--color-secondary-blue)' }); // Secondary Blue
TOKEN_MINT_MAP.set('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', { symbol: 'JUP', name: 'Jupiter', decimals: 6, coingeckoId: 'jupiter-exchange-solana', color: 'var(--color-accent-orange)' }); // Orange
TOKEN_MINT_MAP.set('HZ1JovNiVvGqiOoYBHFjCuD6XrSEbFpgGNH4FRCnxCE', { symbol: 'PYTH', name: 'Pyth Network', decimals: 6, coingeckoId: 'pyth-network', color: 'var(--color-accent-light-purple)' }); // Light Purple
TOKEN_MINT_MAP.set('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', { symbol: 'BONK', name: 'Bonk', decimals: 5, coingeckoId: 'bonk', color: 'var(--color-accent-yellow-orange)' }); // Yellow-Orange

interface TreasuryHistoryEntry {
  date: string;
  value: number;
}

export const useTreasury = () => {
  const [treasuryAssets, setTreasuryAssets] = useState<TreasuryAsset[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [history, setHistory] = useState<TreasuryHistoryEntry[]>(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_LOCAL_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (e) {
      console.error("Failed to parse treasury history from localStorage", e);
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreasuryData = useCallback(async () => {
    console.log('Fetching treasury data...');
    setLoading(true);
    setError(null);
    try {
      const currentAssets: TreasuryAsset[] = [];
      let currentTotalValue = 0;

      // 1. Fetch prices from Jupiter's API
      console.log('Fetching prices from Jupiter API:', JUPITER_PRICE_API);
      const priceResponse = await fetch(JUPITER_PRICE_API);
      if (!priceResponse.ok) {
        throw new Error(`Failed to fetch prices: ${priceResponse.statusText}`);
      }
      const pricesData = await priceResponse.json();
      console.log('Jupiter Price API Response:', pricesData);

      const getPrice = (symbol: string): number => pricesData.data[symbol]?.price || 0;

      // 2. Fetch native SOL balance
      console.log('Fetching SOL balance for address:', SQUADS_MULTISIG_VAULT_ADDRESS);
      const solanaBalanceRpcResponse = await fetch(SOLANA_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [SQUADS_MULTISIG_VAULT_ADDRESS],
        }),
      });
      const solanaBalanceData = await solanaBalanceRpcResponse.json();
      console.log('SOL Balance RPC Response:', solanaBalanceData);

      if (solanaBalanceData.error) {
        throw new Error(`SOL balance RPC error: ${solanaBalanceData.error.message}`);
      }
      const solBalanceLamports = solanaBalanceData.result.value;
      const solBalance = solBalanceLamports / (10 ** 9); // SOL has 9 decimals

      // Using the mint address directly from the map definition for SOL
      const solMintAddress = 'So11111111111111111111111111111111111111112';
      const solTokenInfo = TOKEN_MINT_MAP.get(solMintAddress);

      const solPriceUsd = getPrice('SOL');
      const solValueUsd = solBalance * solPriceUsd;
      currentAssets.push({
        symbol: 'SOL',
        name: 'Solana',
        balance: solBalance,
        valueUsd: solValueUsd,
        color: solTokenInfo?.color || 'var(--color-primary-purple)',
      });
      currentTotalValue += solValueUsd;
      console.log('Processed SOL:', { solBalance, solValueUsd });

      // 3. Fetch SPL token balances
      console.log('Fetching SPL token accounts for owner:', SQUADS_MULTISIG_VAULT_ADDRESS);
      const tokenAccountsRpcResponse = await fetch(SOLANA_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            SQUADS_MULTISIG_VAULT_ADDRESS,
            { programId: TOKEN_PROGRAM_ID },
            { encoding: 'jsonParsed' },
          ],
        }),
      });
      const tokenAccountsData = await tokenAccountsRpcResponse.json();
      console.log('SPL Token Accounts RPC Response:', tokenAccountsData);

      if (tokenAccountsData.error) {
        throw new Error(`SPL token accounts RPC error: ${tokenAccountsData.error.message}`);
      }
      
      for (const account of tokenAccountsData.result.value) {
        const mintAddress = account.account.data.parsed.info.mint;
        // Fix: Directly retrieve from TOKEN_MINT_MAP using mintAddress as the key
        const knownToken = TOKEN_MINT_MAP.get(mintAddress);

        if (knownToken) {
          const balanceRaw = account.account.data.parsed.info.tokenAmount.amount;
          const balance = Number(balanceRaw) / (10 ** knownToken.decimals);
          const priceUsd = getPrice(knownToken.symbol); // Get price by symbol
          const valueUsd = balance * priceUsd;

          currentAssets.push({
            symbol: knownToken.symbol,
            name: knownToken.name,
            balance: balance,
            valueUsd: valueUsd,
            color: knownToken.color,
          });
          currentTotalValue += valueUsd;
          console.log(`Processed ${knownToken.symbol}:`, { balance, valueUsd });
        } else {
            console.log(`Skipping unknown token mint: ${mintAddress}`);
        }
      }
      
      // Sort assets by USD value (descending)
      currentAssets.sort((a, b) => b.valueUsd - a.valueUsd);

      setTreasuryAssets(currentAssets);
      setTotalValue(currentTotalValue);
      console.log('Treasury assets and total value updated.');

      // Update history
      setHistory(prevHistory => {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const lastEntry = prevHistory[prevHistory.length - 1];
        
        if (!lastEntry || lastEntry.date !== today) {
          const newEntry: TreasuryHistoryEntry = {
            date: today,
            value: currentTotalValue,
          };
          const updatedHistory = [...prevHistory, newEntry];
          const trimmedHistory = updatedHistory.slice(-MAX_HISTORY_SNAPSHOTS);
          localStorage.setItem(HISTORY_LOCAL_STORAGE_KEY, JSON.stringify(trimmedHistory));
          console.log('Treasury history updated with new entry:', newEntry);
          return trimmedHistory;
        } else {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1] = { ...lastEntry, value: currentTotalValue };
          localStorage.setItem(HISTORY_LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
          console.log('Treasury history updated (same day, value adjusted):', updatedHistory[updatedHistory.length - 1]);
          return updatedHistory;
        }
      });

    } catch (e) {
      console.error('Failed to fetch treasury data:', e);
      // More explicit error message
      setError(`Live data unavailable: ${e instanceof Error ? e.message : String(e)}.`);
      // Do not clear assets and totalValue immediately, let the component handle showing mock/cached if available.
      // setTreasuryAssets([]); 
      // setTotalValue(0);
    } finally {
      setLoading(false);
      console.log('Treasury data fetch complete.');
    }
  }, []);

  useEffect(() => {
    fetchTreasuryData(); // Initial fetch

    const interval = setInterval(fetchTreasuryData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchTreasuryData]);

  // Expose refetch function for retry button
  const refetch = useCallback(() => {
    console.log('Retrying treasury data fetch...');
    setError(null);
    setLoading(true);
    fetchTreasuryData();
  }, [fetchTreasuryData]);

  return { treasuryAssets, totalValue, history, loading, error, refetch };
};